import test from 'node:test';
import assert from 'node:assert/strict';
import {recordChallenge} from '../shared/challenges.mjs';
import {needsReview,reviewQueue,unansweredQueue,readChallengeReviews,recordReview} from '../shared/challenge-review.mjs';

test('only valid incorrect first answers enter the review queue',()=>{
 const progress={nnt:0,'positive-predictive':2,prevalence:999,sensitivity:-1};
 assert.deepEqual(reviewQueue(progress).map(q=>q.id),['nnt']);
 assert.ok(unansweredQueue(progress).some(q=>q.id==='prevalence'));
 assert.ok(!unansweredQueue(progress).some(q=>q.id==='positive-predictive'));
});
test('successful retry removes a mistake without changing first-answer history',()=>{
 const progress=recordChallenge({},'nnt',0);
 const reviews=recordReview({},progress,'nnt',1);
 assert.deepEqual(progress,{nnt:0});assert.deepEqual(reviews,{nnt:true});
 assert.deepEqual(reviewQueue(progress,reviews),[]);
 assert.deepEqual(recordChallenge(progress,'nnt',1),{nnt:0});
 const missedAgain=recordReview(reviews,progress,'nnt',3);
 assert.deepEqual(reviewQueue(progress,missedAgain).map(q=>q.id),['nnt']);
});
test('review persistence ignores unknown, unattempted, already correct and malformed items',()=>{
 const progress={nnt:0,prevalence:1};
 const store={getItem:()=>JSON.stringify({nnt:true,prevalence:true,sensitivity:true,unknown:true})};
 assert.deepEqual(readChallengeReviews(store,progress),{nnt:true});
 assert.deepEqual(readChallengeReviews(store,{}),{});
 assert.deepEqual(readChallengeReviews({getItem:()=>'{broken'},progress),{});
 assert.deepEqual(readChallengeReviews(null,progress),{});
 assert.deepEqual(recordReview({},progress,'nnt',999),{});
 assert.deepEqual(recordReview({},progress,'unknown',1),{});
 assert.deepEqual(recordReview({},progress,'sensitivity',1),{});
});
