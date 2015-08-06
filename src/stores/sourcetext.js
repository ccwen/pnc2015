var Reflux=require("reflux");
var action=require("../actions/sourcetext");
var dataset=require("dataset");

var SourceText=Reflux.createStore({
	listenables:action
	,onFetch:function(seg,cb) {
		var out=dataset.jwn[seg];
		this.trigger(out,seg);
		if (typeof cb=="function") out.length?cb(0):cb("not found");
	}
	,segments:function() {
		return Object.keys(dataset.jwn);
	}
});
module.exports=SourceText;