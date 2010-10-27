var Pool = function(numres){
   numres = parseInt(numres);
   if(!numres){
      throw new Error('Pool: number of resources must be an integer > 0');
   }
   
   if(!(this instanceof Pool)){
      return new Pool(numres);
   }
   
   var  self = this,
        masks = (function(){
           var a = [];
           for( var i = ( ((numres+31)/32)|0 ); i>0; --i){
              a.push(-1);
           }
           return a;
        })(),
        freeRes = (function(){
           var a = [];
           for(var i = 0; i<numres; ++i){
              a.push(i);
           }
           return a;
        })(),
        waiting = [];
       
   this.alloc = function(cb){
      if(freeRes.length){
         var resid = freeRes.shift();
         masks[resid/32|0] &= ~(1<<(resid % 32));
         cb(resid);
      }else{
         waiting.push(cb);
      }
   };
   this.free = function(resid){
      resid = parseInt(resid);
      if(!isNaN(resid) && resid >= 0 && resid < numres){
         
         var mid = resid/32|0,
             rmask = 1 << (resid % 32);

         if( !(masks[mid] & rmask) ){

            if(waiting.length){
               waiting.shift()(resid);
            }else{
               masks[mid] |= rmask;
               freeRes.push(resid);
            }
         }
      }
   };
   Object.freeze(this);
};


module.exports = {
   Pool: Pool
};
