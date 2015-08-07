var React=require("react");
var E=React.createElement;
var bs=require("react-bootstrap");
var Reflux=require("reflux");
var LinkView=require("ksana-layer-react").LinkView;
var store_sourcetext=require("../stores/sourcetext");

var Texts=React.createClass({
	mixins:[Reflux.listenTo(store_sourcetext,"onSourceText")]
	,getInitialState:function() {
		return {text:"",uti:"",tags:[]};
	}
	,onSourceText:function(text,uti,hits) {
		this.setState({text:text,uti:uti,highlights:hits});
	}
	,onSelectText:function() {
		console.log(arguments);
	}
	,renderText:function() {
		return E(LinkView,{
				id:this.state.uti
				,highlights:this.state.highlights
				,onSelectText:this.onSelectText,text:this.state.text}
				);
	}
	,render:function(){
		return this.renderText();
	}
})

//,onClickTag:this.onClickTag,onEnterTag:this.onEnterTag,onLeaveTag:this.onLeaveTag
//,selections:selections,links:links,highlights:highlights


module.exports=Texts;