var React=require("react/addons");
var PureRenderMixin=React.addons.PureRenderMixin;
var E=React.createElement;
var Translation=React.createClass({
	mixins:[PureRenderMixin]
	,render:function() {
		return <div>{this.props.content}</div>
	}
});
module.exports=Translation;