var exam = require('examiner').examine;
    Pool = require('../index.js').Pool;

exam('Constructor',{
   'valid numres': function(a){
      try{
         var p = new Pool(1);
      }catch(e){
         a.ok(false);
      }
      a.done();
   },
   
   'invalid numres (NaN)': function(a){
      try{
         new Pool('a');
         a.ok(false);
      }catch(e){
         // OK
      }
      
      a.done();
   },
   
   'invalid numres (0)': function(a){
      try{
         new Pool('a');
         a.ok(false);
      }catch(e){
         // OK
      }
      
      a.done();
   }
});

exam('alloc',{
   'too many requests wait': function(a){
      var p = new Pool(2),
          count = 0,
          cb = function(){
             ++count;
          };
      
      p.alloc(cb);
      p.alloc(cb);
      p.alloc(cb);
      a.equal(count,2);
      a.done();
   },
   'unique resids': function(a){
      var p = new Pool(33),
          res = [],
          cb = function(resid){
             a.ok(!res[resid]);
             res[resid] = true;
          };
      
      for(var i=0; i<33; ++i){
         p.alloc(cb);
      }
      a.done();
   }
});


exam('free',{
   'waiting requests called on free': function(a){
      var p = new Pool(2),
          count = 0,
          lastresid = -1;
          cb = function(resid){
             ++count;
             lastresid = resid;
          };
      
      p.alloc(cb);
      p.alloc(cb);
      p.alloc(cb);
      p.alloc(cb);
      a.equal(count,2);
      
      p.free(0);
      a.equal(count,3);
      a.equal(lastresid,0);
      
      p.free(1);
      a.equal(count,4);
      a.equal(lastresid,1);
      
      p.free(1);
      a.equal(count,4);
      a.done();
   }
});