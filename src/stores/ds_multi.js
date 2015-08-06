var Reflux=require("reflux");
var action=require("../action/ds_multi");
var kse=require("ksana-search");
var ds_multi_store=Reflux.createStore({
	listenables:[action]
	,init:function() {
		kse.search("ds_multi","",{},function(err,data){
			this.db=data.engine;
		}.bind(this));
	}
	,transid:function(trans) {
		var showtrans=[];
		for (var i=0;i<trans.length;i++) {
			var idx=this.db.findFile("ds_m_"+trans[i]+".csv")	;
			showtrans.push(idx);
		}
		return showtrans;		
	}
	,onGetTran:function(trans) {
		var keys=[], out=[];
		var transfileid=this.transid(trans);
		var id="1.2";
		var segs=this.db.findSeg(id);

		for (var i=0;i<segs.length;i++) {
			var show=transfileid.indexOf(segs[i].file);
			if (show==-1) continue;
			out.push({id:id,content:"", tran:trans[show]});
			keys.push(["filecontents",segs[i].file,segs[i].seg])
		}
		if (keys.length==0) {
			this.trigger([]);
			return;
		}


		this.db.get(keys,{},function(data){
			for (var i=0;i<data.length;i++) {
				out[i].content=data[i];
			}
			this.trigger(out);
		}.bind(this));
	}
})
module.exports=ds_multi_store;