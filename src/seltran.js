var React=require("react");
var action=require("./action/ds_multi");
var trans={
	"romanized":"Sanskrit",
	"tibetan":"Tibetan",
	"kumarajiva":"鳩摩羅什",
	"gupta":"達磨笈多",
	"xuanzang":"玄奘",
	"yijing":"義淨"
};
var translations=[];
var Seltran=React.createClass({
	addTran:function(tran) {
		this.remove(tran);
		translations.push(tran);
		action.getTran(translations);
	}
	,remove:function(tran) {
		var i=translations.indexOf(tran);
		if (i>-1) translations.splice(i,1);
	}
	,removeTran:function(tran){
		this.remove(tran);
		action.getTran(translations);
	}
	,gettran:function(e) {
		e.target.checked?this.addTran(e.target.value):
			this.removeTran(e.target.value);
	},
	renderTran:function(k) {
		return <label><input onClick={this.gettran} 
		type="checkbox" value={k}/>{trans[k]}</label>
	}
	,render:function() {
		return <div >
			{Object.keys(trans).map(this.renderTran)}
		</div>
	}
});
module.exports=Seltran;