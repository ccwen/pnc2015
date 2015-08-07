var React=require("react");
var E=React.createElement;
var bs=require("react-bootstrap");
var SegNav=require("ksana2015-segnav");
var SegFilter=require("ksana2015-segfilter");
var action_sourcetext=require("../actions/sourcetext");
var store_sourcetext=require("../stores/sourcetext");
var segs=store_sourcetext.segments();
var texts=store_sourcetext.fetchAll();
var styles={
	controls:{fontSize:"120%"}
}

var Controls=React.createClass({
	getInitialState:function() {
		var lastseg=localStorage.getItem("pnc2015.seg")||"義因文顯-1";
		var lastregex=localStorage.getItem("pnc2015.regex")||"平等";
		return {seg:lastseg,editing:null,regex:lastregex}
	}
	,onGoSegment:function(segnow,hits,regex) {
		this.setState({seg:segnow});
		action_sourcetext.fetch(segnow,hits,function(err){
			if (!err) {
				localStorage.setItem("pnc2015.seg",segnow);
				if (regex) localStorage.setItem("pnc2015.regex",regex);
			}
		});
	}
	,componentDidMount:function() {
		action_sourcetext.fetch(this.state.seg);
	}
	,renderAction:function() {
	}
	,render:function() {
		return E("div",{style:styles.controls}
				,E(SegNav,{segs:segs,segpat:"(.+?-[0-9]+)",style:{fontSize:"100%"},
						value:this.state.seg,onGoSegment:this.onGoSegment})
				,E(SegFilter,{texts:texts,regex:this.state.regex,style:{fontSize:"100%"},onGoSegment:this.onGoSegment})
				,E("span")
      	, this.renderAction()
     );
	}
});
//      	,E("span",{className:"pull-right"},E(LoginBox))

module.exports=Controls;