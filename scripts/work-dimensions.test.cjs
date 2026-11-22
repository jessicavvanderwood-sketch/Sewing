'use strict';

const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const {runInNewContext}=require('node:vm');
const assert=require('node:assert/strict');
const test=require('node:test');

const scripts=['models.js','work-dimensions.js'].map(file=>readFileSync(join(__dirname,'..','dist',file),'utf8'));
const workDimensions=runInNewContext([...scripts,'workDimensions'].join('\n'));

test('the target column in a work-order snapshot determines lower-body distances',()=>{
  const {rows}=workDimensions.resolve({measurements:{rows:[
    ['Waist to floor','98 cm','103 cm'],
    ['Waist to full hip','16 cm','19 cm'],
    ['Body inseam','80 cm','77 cm'],
    ['Kneecap center to floor','51 cm','47 cm'],
    ['Fullest calf to floor','28 cm','32 cm']
  ]}});
  assert.equal(rows.crotchToFloor.cm,77);
  assert.equal(rows.crotchToFloor.source,'model');
  assert.equal(rows.waistToCrotch.cm,26);
  assert.equal(rows.crotchToKnee.cm,30);
  assert.equal(rows.kneeToCalf.cm,15);
  assert.equal(rows.calfToFloor.cm,32);
  assert.equal(rows.hipToKnee.cm,37);
  assert.equal(rows.waistToCrotch.source,'derived');
  assert.equal(rows.garmentInseam.cm,null);
  assert.equal(rows.finishedRise.cm,null);
  assert.equal(rows.backRise.cm,null);
});

test('finished inseam and both seam rises come only from the work-order plan',()=>{
  const {rows}=workDimensions.resolve({
    body:{profile:'female',inseam:77,waistToFloor:103},
    plan:{landmarkDistances:{garmentInseam:65.5,finishedRise:26.2,backRise:31,kneeToHem:16}}
  });
  for (const [key,cm] of Object.entries({garmentInseam:65.5,finishedRise:26.2,backRise:31,kneeToHem:16})) {
    assert.equal(rows[key].cm,cm);
    assert.equal(rows[key].source,'sample');
  }
  assert.equal(rows.crotchToFloor.cm,77);
  const {rows:fromBody}=workDimensions.resolve({body:{profile:'female',height:170}});
  assert.equal(fromBody.crotchToFloor.source,'estimate');
  assert.equal(fromBody.calfToFloor.source,'estimate');
  assert.match(workDimensions.value(fromBody.crotchToFloor),/^Est\. \d/);
  assert.equal(workDimensions.value(fromBody.garmentInseam),'Measure on fitted sample');
  assert.equal(workDimensions.value(fromBody.backRise),'Measure on fitted sample');
});

test('old snapshot units convert and missing or incompatible endpoints do not imply a measured span',()=>{
  const {rows}=workDimensions.resolve({measurements:{rows:[
    ['Waist to floor','40 in','31 in'],
    ['Body inseam','31 in','32 in'],
    ['Kneecap center to floor','18 in','—'],
    ['Fullest calf to floor','32 cm','30.25 cm']
  ]}});
  assert.equal(rows.crotchToFloor.cm,32*2.54);
  assert.equal(rows.waistToCrotch.cm,null);
  assert.equal(rows.crotchToKnee.cm,null);
  assert.equal(rows.kneeToCalf.cm,null);
  assert.equal(rows.calfToFloor.cm,30.25);
});
