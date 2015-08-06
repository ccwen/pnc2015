var React=require("react");
var E=React.createElement;
var bs=require("react-bootstrap");
var SegNav=require("ksana2015-segnav");
var action_sourcetext=require("../actions/sourcetext");
var store_sourcetext=require("../stores/sourcetext");
var segs=store_sourcetext.segments();

var styles={
	controls:{fontSize:"150%"}
}

var Controls=React.createClass({
	getInitialState:function() {
		var lastseg=localStorage.getItem("pnc2015.seg")||"義因文顯-1";
		return {seg:lastseg,editing:null}
	}
	,onGoSegment:function(segnow) {
		this.setState({seg:segnow});
		action_sourcetext.fetch(segnow,function(err){
			if (!err) {
				localStorage.setItem("pnc2015.seg",segnow);
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
				,E(SegNav,{segs:segs,segpat:"(.+?-[0-9]+)",value:this.state.seg,onGoSegment:this.onGoSegment})
				,E("span")
      	, this.renderAction()
     );
	}
});
//      	,E("span",{className:"pull-right"},E(LoginBox))

module.exports=Controls;