var Reflux=require("reflux");
var action=require("../actions/sourcetext");
var dataset=require("dataset");

var SourceText=Reflux.createStore({
	listenables:action
	,onFetch:function(seg,hits,cb) {
		if (typeof hits=="function") {
			cb=hits;
			hits=null;
		}
		var out=dataset.jwn[seg];
		this.trigger(out,seg,hits);
		if (typeof cb=="function") out.length?cb(0):cb("not found");
	}
	,segments:function() {
		return Object.keys(dataset.jwn);
	}
	,fetchAll:function() {
		return dataset.jwn;
	}
});
module.exports=SourceText;