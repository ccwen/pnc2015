var React=require("react");
var Reflux=require("reflux");
var Translation=require("./translation");
var ds_multi_store=require("./store/ds_multi");
var E=React.createElement;
var Translations=React.createClass({
	getInitialState:function() {
		return {translations:[]};
	}
	,mixins:[Reflux.listenTo(ds_multi_store,"onData")]
	,onData:function(data) {
		this.setState({translations:data});
	}
	,renderTranslation:function(tran) {
		return E(Translation,tran);
	}
	,render:function() {
		return E("div",{},this.state.translations.map(this.renderTranslation))
	}
});
module.exports=Translations;