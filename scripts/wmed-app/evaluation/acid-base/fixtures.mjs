// Original synthetic software fixtures. NOT adjudicated clinical cases or training data.
// Constants below are authored independently of the implementation under evaluation.
const clone = x => structuredClone(x);
const measure = (value, unit, source, collection = 'fictional-collection-A') => ({value, unit, source, collection});
const gap = {calculator:'gap', population:'adult', measurements:{
 na:measure('140','mEq/L','chemistry'), cl:measure('104','mEq/L','chemistry'), hco:measure('24','mEq/L','chemistry')
}};
const winter = {calculator:'winter', population:'adult', sample:'arterial', metabolicAcidosisConfirmed:true,
 bicarbonateAgreement:'confirmed', measurements:{hco:measure('12','mEq/L','chemistry')},
 observation:{pH:'7.29', pco2:'26', pco2Unit:'mmHg', collection:'fictional-collection-A'}};
const blocked = reason => ({status:'blocked', reason});
const gapResult = value => ({status:'calculated', value, unit:'mEq/L'});
const winterResult = (value,low,high) => ({status:'calculated', value, low, high, unit:'mmHg'});
function fixture(id, topic, base, edit, expected) {const input=clone(base);edit(input);return {id,topic,synthetic:true,clinicalReview:'pending',input,expected};}
export const corpusVersion='2026-09-25.1';
export const fixtures=[
 fixture('gap-basic','arithmetic',gap,()=>{},gapResult(12)),
 fixture('gap-decimal-comma','decimal',gap,x=>{x.measurements.na.value='140,5';x.measurements.cl.value='104.5';},gapResult(12)),
 fixture('gap-negative','negative-result',gap,x=>{x.measurements.cl.value='120';},gapResult(-4)),
 fixture('gap-lower-input-bounds','bounds-not-normal-ranges',gap,x=>{x.measurements.na.value='80';x.measurements.cl.value='50';x.measurements.hco.value='1';},gapResult(29)),
 fixture('gap-upper-input-bounds','bounds-not-normal-ranges',gap,x=>{x.measurements.na.value='200';x.measurements.cl.value='170';x.measurements.hco.value='60';},gapResult(-30)),
 fixture('gap-outside-bound','bounds',gap,x=>{x.measurements.na.value='200.001';},blocked('invalid-number')),
 fixture('gap-hex','input-format',gap,x=>{x.measurements.na.value='0x8c';},blocked('invalid-number')),
 fixture('gap-missing-chloride','missing',gap,x=>{delete x.measurements.cl;},blocked('missing-measurement')),
 fixture('gap-empty-bicarbonate','missing',gap,x=>{x.measurements.hco.value='';},blocked('incomplete-number')),
 fixture('gap-unit-absent','units',gap,x=>{delete x.measurements.na.unit;},blocked('unsupported-unit')),
 fixture('gap-unit-mgdl','units',gap,x=>{x.measurements.na.unit='mg/dL';},blocked('unsupported-unit')),
 fixture('gap-unit-mmol','units-not-yet-enabled',gap,x=>{x.measurements.na.unit='mmol/L';},blocked('unsupported-unit')),
 fixture('gap-mixed-collection','collection',gap,x=>{x.measurements.cl.collection='fictional-collection-B';},blocked('collection-mismatch')),
 fixture('gap-missing-collection','collection',gap,x=>{delete x.measurements.na.collection;},blocked('missing-collection')),
 fixture('gap-mixed-source','bicarbonate-origin',gap,x=>{x.measurements.hco.source='blood-gas';},blocked('unsupported-source')),
 fixture('gap-child','population',gap,x=>{x.population='pediatric';},blocked('unsupported-population')),
 fixture('winter-basic','arithmetic',winter,()=>{},winterResult(26,24,28)),
 fixture('winter-comma','decimal',winter,x=>{x.measurements.hco.value='12,5';},winterResult(26.75,24.75,28.75)),
 fixture('winter-low-bound','bounds-not-normal-ranges',winter,x=>{x.measurements.hco.value='1';},winterResult(9.5,7.5,11.5)),
 fixture('winter-high-bound','bounds-not-normal-ranges',winter,x=>{x.measurements.hco.value='30';},winterResult(53,51,55)),
 fixture('winter-outside-bound','bounds',winter,x=>{x.measurements.hco.value='30.001';},blocked('invalid-number')),
 fixture('winter-exponent','input-format',winter,x=>{x.measurements.hco.value='1e1';},blocked('invalid-number')),
 fixture('winter-extra-precision','input-format',winter,x=>{x.measurements.hco.value='12.0001';},blocked('invalid-number')),
 fixture('winter-venous','sample',winter,x=>{x.sample='venous';},blocked('arterial-sample-required')),
 fixture('winter-unknown-sample','sample',winter,x=>{delete x.sample;},blocked('arterial-sample-required')),
 fixture('winter-unconfirmed-context','context',winter,x=>{x.metabolicAcidosisConfirmed=false;},blocked('context-unconfirmed')),
 fixture('winter-context-string','context',winter,x=>{x.metabolicAcidosisConfirmed='true';},blocked('context-unconfirmed')),
 fixture('winter-unresolved-bicarbonates','bicarbonate-origin',winter,x=>{x.bicarbonateAgreement='unresolved';},blocked('bicarbonate-review-required')),
 fixture('winter-source-absent','bicarbonate-origin',winter,x=>{delete x.measurements.hco.source;},blocked('unsupported-source')),
 fixture('winter-gas-bicarbonate','bicarbonate-origin',winter,x=>{x.measurements.hco.source='blood-gas';},winterResult(26,24,28)),
 fixture('winter-pco2-kpa','units-not-yet-enabled',winter,x=>{x.observation.pco2Unit='kPa';},blocked('unsupported-pressure-unit')),
 fixture('winter-observation-collection','collection',winter,x=>{x.observation.collection='fictional-collection-B';},blocked('collection-mismatch')),
 fixture('winter-ph-apparently-normal','no-primary-diagnosis-inference',winter,x=>{x.observation.pH='7.40';x.observation.pco2='20';},winterResult(26,24,28)),
 fixture('winter-observed-pco2-above','no-mixed-disorder-classification',winter,x=>{x.observation.pco2='40';},winterResult(26,24,28)),
 fixture('winter-observed-pco2-below','no-mixed-disorder-classification',winter,x=>{x.observation.pco2='20';},winterResult(26,24,28)),
 fixture('winter-no-observation','arithmetic-without-interpretation',winter,x=>{delete x.observation;},winterResult(26,24,28)),
 fixture('winter-observation-unit-absent','units',winter,x=>{delete x.observation.pco2Unit;},blocked('unsupported-pressure-unit')),
 fixture('unknown-formula','allowlist',gap,x=>{x.calculator='delta-gap';},blocked('unsupported-calculator')),
];
