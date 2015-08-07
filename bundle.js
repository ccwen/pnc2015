(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\ksana2015\\node_modules\\ksana-layer-react\\index.js":[function(require,module,exports){
var FlattenView=require("./src/flattenview");
var SelectableView=require("./src/selectableview");
var InterlineView=require("./src/interlineview");
var LinkView=require("./src/linkview");

var textrange=require("./src/textrange");
var markuputil=require("./src/markuputil");

//var BaseView=require("./src/baseview");
//var MultiSelectView=require("./src/multiselectview");
//var ReviseView=require("./src/reviseview");


//var RevisionView=require("./src/revisionview");

module.exports={FlattenView:FlattenView
	,SelectableView:SelectableView
	,InterlineView:InterlineView
	,LinkView:LinkView
	,textrange:textrange
  ,markuputil:markuputil
};
},{"./src/flattenview":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\flattenview.js","./src/interlineview":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\interlineview.js","./src/linkview":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\linkview.js","./src/markuputil":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\markuputil.js","./src/selectableview":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\selectableview.js","./src/textrange":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\textrange.js"}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\caretpos.js":[function(require,module,exports){
var create=function(_text) {
	var caretPos={},pos=0,text=_text;

	caretPos.get=function(){
		return pos;
	}

	var nonstop=function(code) {
		return (code>=0xDC00 && code<=0xDFFF) || (code>=0x0f71 && code<=0x0f87)|| (code>=0x0f8d && code<=0x0fbc);
	}

	var snapNext=function(_pos) {
		if (typeof _pos=="undefined") _pos=pos;
		var code=text.charCodeAt(_pos);
		while (nonstop(code)) {
			_pos++;
			code=text.charCodeAt(_pos);
		}
		return _pos	}
	var snapPrev=function(_pos) {
		if (typeof _pos=="undefined") _pos=pos;
		var code=text.charCodeAt(_pos);
		while (nonstop(code)) {
			_pos--;
			code=text.charCodeAt(_pos);
		}
		return _pos;	
	}	
	caretPos.next=function(_pos){
		pos=snapPrev(_pos);
		pos++;	
		var code=text.charCodeAt(pos);
		while (nonstop(code)) {
			pos++;
			code=text.charCodeAt(pos);
		}
		if (pos>text.length) pos=text.length;
		return pos;
	}
	caretPos.nextToken=function(_pos) {
		var start=snapPrev(_pos);
		this.next(start);
		return text.substring(start,pos);
	}
	caretPos.prevToken=function(_pos) {
		var end=snapNext(_pos);
		this.prev(end);
		return text.substring(pos,end);
	}
	caretPos.prev=function(_pos) {
		pos=snapNext(_pos);
		pos--;
		var code=text.charCodeAt(pos);
		while (nonstop(code)) {
			pos--;
			code=text.charCodeAt(pos);
		}
		if (pos<0) pos=0;
		return pos;
	}
	caretPos.valid=function(_pos) {
		return !nonstop(text.charCodeAt(_pos));
	}

	return caretPos;
}
module.exports={create:create};
},{}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\defaultspan.js":[function(require,module,exports){
/*
  Span's styles is created by merging styles of all tags covering the span.
*/
try {
  var React=require("react-native");
  var PureRenderMixin=null;
} catch(e) {
  var React=require("react/addons");
  var PureRenderMixin = React.addons.PureRenderMixin;
}
var E=React.createElement,PT=React.PropTypes;


var mergeStyles=function(styles) {
  if (!styles.length) return {}; //should return {} instead of null , otherwise react don't apply style
  var out={};
  for (var i=0;i<styles.length;i++) {
    for (var key in styles[i]) {
      out[key]=styles[i][key];
    }
  }
  return out;
}
var SpanClass = React.createClass({
  displayName:"defaultSpan"
  ,mixins:[PureRenderMixin]
  ,propTypes:{
    tid:PT.array
    ,index:PT.number
    ,tags:PT.array.isRequired
    ,start:PT.number.isRequired
    ,tagStyles:PT.object
    ,onLeaveTag:PT.func
    ,onEnterTag:PT.func
  }
  ,getTagStyle:function(tid) {
    if (!tid) return {};
    var out=[];
    for (var i=0;i<tid.length;i++){
      var m=tid[i];
      var styles=this.props.styles;
      var tag=this.props.tags[m];
      tag.style&&out.push(tag.style);
      var type=tag.className;
      styles[type]&&out.push(styles[type]);
      styles[type+"_first"]&&out.push(styles[type+"_first"]);
      styles[type+"_last"]&&out.push(styles[type+"_last"]);        
    };
    return out;
  }
  ,getTagType:function(tid){
    if (!tid) return [];
    var out=[];
    for (var i=0;i<tid.length;i++){
      var m=tid[i];
      var styles=this.props.styles;
      var tag=this.props.tags[m];
      var type=tag.className;
      type&&out.push(type);
    }
    return out;
  }
  ,getTid:function(e) {
    var node=e.target;
    while (node&&typeof node.dataset["start"]=="undefined") {
      node=node.parentNode;
    }
    var tid=node.dataset["tid"];
    return tid;
  }
  ,onMouseEnter:function(e) {
    var tid=this.getTid(e);
    if(this.props.onEnterTag && tid) this.props.onEnterTag(e,tid);
  }
  ,onMouseLeave:function(e) {
    var tid=this.getTid(e);
    if(this.props.onLeaveTag && tid) this.props.onLeaveTag(e,tid);
  }
  ,render:function() {
    var styles=this.getTagStyle(this.props.tid);
    var style=mergeStyles(styles);
    var span=React.Text||"span";
    
    var props={"data-tid":this.props.tid,style:style,"data-start":this.props.start
    ,onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave};    
    props.className=this.getTagType(this.props.tid).join(" ");  //pass className as it's  
    
    return E(span,props,this.props.children);
  }
});
module.exports=SpanClass;

},{"react-native":"react-native","react/addons":"react/addons"}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\flattenview.js":[function(require,module,exports){
/*
	Core markup display component,
	"flatten" text, tags (with styles) to single layer.
*/
try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;


var spreadMarkup=require("./markuputil").spreadMarkup;
var caretPos=require("./caretpos");
var defaultSpan=require("./defaultspan");
var FlattenView=React.createClass({
	displayName:"FlattenView"
	,mixins:[PureRenderMixin]
	,propTypes:{
		text:React.PropTypes.string.isRequired
		,tags:PT.array
		,styles:PT.object
		,span:PT.func
		,style:PT.object
		,allowKeys:PT.array
		,onEnterTag:PT.func
		,onLeaveTag:PT.func
	}
	,getDefaultProps:function() {
		return {tags:[],styles:{},span:defaultSpan};
	}
	,tagAtPos:[] // hold covering tags given a text position
	,mergeStyle:function(style) {
		this.style=style||{};
		if (!this.style.lineHeight||!this.style.outline) {
			this.style=update(this.style,{$merge:{
				outline : "0px solid transparent", lineHeight:"180%"
			}});
		}		
	}
	,componentWillMount:function() {
		this.mergeStyle(this.props.style);
		this.tagAtPos=spreadMarkup(this.props.tags);
	}
	,componentWillReceiveProps:function(nextProps) {
		this.mergeStyle(nextProps.style);
		this.tagAtPos=spreadMarkup(nextProps.tags);
	}
	,renderSpan:function(out,start,end,spantext,tid) {
		var before=[],after=[], tags=this.props.tags;
		(tid||[]).map(function(m){ 
			if (tags[m].before&& start===tags[m].s) { 
				before.push(tags[m].before);
			}
		});
		before.length && out.push(E(React.Text||"span",{key:"b"+start},before));

		out.push(E(this.props.span,{index:this.props.index
					,onEnterTag:this.props.onEnterTag,onLeaveTag:this.props.onLeaveTag
					,styles:this.props.styles,key:'s'+start, tags:tags,tid:tid,start:start}
				,spantext)
		);

		(tid||[]).map(function(m){ 
			if (tags[m].after && end===tags[m].s+tags[m].l) {
				after.push(tags[m].after);
			} 
		});
		
		after.length && out.push(E(React.Text||"span",{key:"a"+start},after));
		return out;
	}
	,renderChildren:function() {
		var sameArray=function(a1,a2) {
			if (!a1 && !a2) return true; //both are empty
			if ((!a1 && a2) || (a1 && !a2) ) return false;
			return a1.toString()===a2.toString(); //one dimensional array
		}
		var out=[], spantext="" ,start=0, previous=["impossible item"] ;
		var caretpos=caretPos.create(this.props.text);

		while (caretpos.get()<this.props.text.length) {
			var i=caretpos.get();
			if (!sameArray(this.tagAtPos[i],previous)) {
				spantext && (out=this.renderSpan(out,start,i,spantext,previous));
				start=i;
				spantext="";
			}
			previous=(this.tagAtPos[i]&&this.tagAtPos[i].length)?JSON.parse(JSON.stringify(this.tagAtPos[i])):null; 
			if (i>this.tagAtPos.length) break;
			spantext += caretpos.nextToken();
		}
		spantext=this.props.text.substr(start);
		spantext && (out=this.renderSpan(out,start,i,spantext,previous));
		return out;
	}
	,render:function() {
		var props=update(this.props, {$merge:{spellCheck:false, style:this.style}});
		return E(React.View||"div",props,this.renderChildren());
	}
});
module.exports=FlattenView;
},{"./caretpos":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\caretpos.js","./defaultspan":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\defaultspan.js","./markuputil":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\markuputil.js","react-native":"react-native","react/addons":"react/addons"}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\interline.js":[function(require,module,exports){
try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;

var Embed=React.createClass({
	render:function() {
		return E("span",this.props,this.props.children);
	}
});
var Super=React.createClass({
	render:function() {
		return E("div",{style:{position:"absolute",left:0,top:"-1.2em",width:"1000px"}}
			,this.props.children);
	}
});
var Sub=React.createClass({
	render:function() {
		return E("div",{style:{position:"absolute",left:0,top:"0.6em",width:"1000px"}}
			,this.props.children);
	}
});
var Container=React.createClass({
	render:function() {
		return E("span",{style:{position:"relative"}}
			,this.props.children);
	}
});

module.exports={Container:Container,Super:Super, Sub:Sub, Embed:Embed};
},{"react-native":"react-native","react/addons":"react/addons"}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\interlineview.js":[function(require,module,exports){
/*
	InterlineView
	filter markups and create tags and pass to selectableview

	markups : data from firebase,
	          interline editor mutate markups and write back to database.

	tags: with before/after component and className, ready for render
		    tags are generated on-the-fly , no need to save.

*/

try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;

var SelectableView=require("./selectableview");
var markup2tag=require("./markup2tag");
var keyboard_mixin=require("./keyboard_mixin");
var InterlineView=React.createClass({
	mixins:[PureRenderMixin]
	,propTypes:{
		markups:PT.object.isRequired  //markup from firebase
		,user:PT.string
		,allowkeys:PT.array
		,onKeyPress:PT.func
	}
	,getInitialState:function() {
		var allowKeys=keyboard_mixin.arrowkeys;
		if (this.props.allowKeys && this.props.allowKeys.length) {
			allowKeys=allowKeys.concat(this.props.allowKeys);
		}
		//markupActivated : { mid: true , mid: false }; //otherwise it is not initialized
		return {tags:[],editing:null,hovering:null,markupActivated:{},allowKeys:allowKeys};
	}
	,onKeyPress:function(e) {
		var nn=e.target.nodeName;
		if (nn==="INPUT" || nn==="TEXTAREA") return;

		if (this.state.allowKeys.indexOf(e.key)>-1) {
			if (this.props.onKeyPress) this.props.onKeyPress(e);
		} else {
			e.preventDefault();
		}
	}
	,componentWillUpdate:function(nextProps,nextState) {
		this.markup2tag(nextProps,nextState);
	}
	,componentDidMount:function() {
		this.forceUpdate();
	}
	,markup2tag:function(nextProps,nextState) {
		var status={editing:nextState.editing,hovering:nextState.hovering
			,text:nextProps.text
			,action:this.action,markupActivated:nextState.markupActivated,action:this.action};

		nextState.tags=markup2tag(nextProps.markups,status);
		nextState.markupActivated=status.markupActivated; //markup2tag might change markupActivated
	}
  ,activateMarkup:function(mid) {
  	var m=this.props.markups[mid];
  	if (!m)return;
		var markupActivated=this.deactivateOverlapMarkup(m.s,m.l);
		var activate={};
		activate[mid]=true;
		var ma=update(markupActivated,{$merge:activate});
		this.setState({editing:null,hovering:null,markupActivated:ma});
  }
  ,componentWillReceiveProps:function(nextProps) {
  	if (nextProps.editing!==this.props.editing) {
  		this.activateOrEditMarkup(nextProps.editing,nextProps);
  	}
  }
  ,activateOrEditMarkup:function(mid,props) {
  	if (!props) props=this.props;
  	if (!mid || !this.props.markups[mid]) return;
  	if (this.props.markups[mid].author===this.props.user) {
  		this.setState({editing:mid,hovering:null});
  	} else {
  		this.activateMarkup(mid);
  	}
  }
  ,deactivateMarkup:function(mid) {
		var markupActivated=this.state.markupActivated;
		var deactive={};
		deactive[mid]=false;
		var ma=update(markupActivated,{$merge:deactive});
		this.setState({editing:null,hovering:null,markupActivated:ma});
  }
  ,deactivateOverlapMarkup:function(start,len) {
		//set state to 0 for any overlap markup
		var deactive={};
		for (var mid in this.props.markups) {
			var m=this.props.markups[mid];
			if (!(start>=m.s+m.l || start+len<=m.s) ) {
				if (this.state.markupActivated[mid]) deactive[mid]=false;
		  }
			if (start===m.s && this.state.markupActivated[mid]) deactive[mid]=false;
		};
		return update(this.state.markupActivated,{$merge:deactive});
  }
  ,setMarkup:function(mid,key,value) {
  	var m=this.props.markups[mid];
  	var obj={};
  	obj[key]=value;
  	this.props.markups[mid]=update(m,{$merge:obj});
  	this.forceUpdate();
  }
	,action:function(act,p1,p2,p3) {
		if(act==="enter") {
 			this.setState({hovering:p1})
		} else if (act==="leave") {
			if (this.state.editing) {
				this.props.onDoneEdit&&this.props.onDoneEdit(this.state.editing);
			}
			this.setState({hovering:null,editing:null});
		} else if (act==="activate") {
			this.activateMarkup(p1);
		} else if (act==="deactivate") {
			this.deactivateMarkup(p1)
		} else if (act==="activate_edit") { //
			this.activateOrEditMarkup(p1);
		} else if (act==="setMarkup") {
			this.setMarkup(p1,p2,p3);
		}
	}
	,render:function(){
		var props=update(this.props,{$merge:{tags:this.state.tags,
			selectable:this.props.selectable,
			allowKeys:this.state.allowKeys,
			onFocus:this.props.onFocus,
			onBlur:this.props.onBlur,
			onKeyPress:this.onKeyPress}});
		delete props.markups;//hide markups from flattenview
		return E(SelectableView,props);
	}

});

module.exports=InterlineView;
},{"./keyboard_mixin":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\keyboard_mixin.js","./markup2tag":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\markup2tag.js","./selectableview":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\selectableview.js","react-native":"react-native","react/addons":"react/addons"}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\keyboard_mixin.js":[function(require,module,exports){

var keyboard_mixin={
	arrowkeys:["ArrowRight","ArrowLeft","ArrowUp","ArrowDown","PageUp","PageDown","Home","End"],
	onkeydown:function(e) {
		var nodename=e.target.nodeName;
		if (nodename==="INPUT" || nodename==="TEXTAREA") return;
		var allowkeys=this.state.allowkeys||[];
		if (allowkeys.indexOf(e.key)>-1 || (e.ctrlKey && e.keyCode===67)) return; //allow ctrl+c

		e.preventDefault();
	}
}
module.exports=keyboard_mixin;
},{}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\linkview.js":[function(require,module,exports){
/*
	View for building intertextual link.
*/
try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;

var SelectableView=require("./selectableview");
var keyboard_mixin=require("./keyboard_mixin");
var styles={
	link:{borderBottom:"2px solid #0000ff"}
	,highlight:{background:"yellow",borderRadius:".5em",borderBottom:""}
}

var InterlineView=React.createClass({
	mixins:[PureRenderMixin]
	,propTypes:{
		links:PT.object
		,highlights:PT.array
		,selections:PT.array
		,user:PT.string
		,allowkeys:PT.array
		,onKeyPress:PT.func
		,onHoverLink:PT.func
	}
	,getDefaultProps:function() {
		return {links:{},highlights:[],selections:[],user:"anonymous"};
	}
	,componentWillUpdate:function(nextProps,nextState) {
		this.combinetag(nextProps,nextState);
	}
	,componentDidMount:function() {
		this.forceUpdate();
	}
	,combinetag:function(props,state) {
		var tags=[];
		for (var key in props.links) {
			props.links[key].forEach(function(H){
				tags.push({s:H[0], l:H[1],style:styles.link, mid:key});
			});
		}
		for (var i=0;i<props.highlights.length;i++) {
			var H=props.highlights[i];
			tags.push({s:H[0], l:H[1], style:styles.highlight, mid:"hover_"+i});	
		}
		state.tags=tags;
	}	
	,getInitialState:function() {
		var allowKeys=keyboard_mixin.arrowkeys;
		if (this.props.allowKeys && this.props.allowKeys.length) {
			allowKeys=allowKeys.concat(this.props.allowKeys);
		}
		return {tags:[],editing:null,hovering:null,markupActivated:{},allowKeys:allowKeys};
	}
	,onClick:function(e,reactid) {
		if (this.hoveringTag && this.props.onClickTag) {
			this.props.onClickTag(e,reactid,this.hoveringTag);
		}
	}
	,onLeaveTag:function(e,tid) {
		this.hovering=null;
		this.hoveringTag=null;
		var leavingTag=null;
		if (this.state.tags[tid]) leavingTag=this.state.tags[tid].mid;
		e.target.style.cursor="";
		if (this.props.onLeaveTag) {
			this.props.onLeaveTag(e,tid,leavingTag);
		}
	}
	,onEnterTag:function(e,tid) {
		this.hovering=e.target;
		this.hoveringTag=null;	
		if (this.state.tags[tid]) this.hoveringTag=this.state.tags[tid].mid;
		if (this.props.onEnterTag) {
			this.props.onEnterTag(e,tid,this.hoveringTag);
		}
		e.target.style.cursor="pointer";
	}
	,render:function(){
		var props=update(this.props,{$merge:{tags:this.state.tags,
			selectable:this.props.selectable,
			allowKeys:this.state.allowKeys,
			onEnterTag:this.onEnterTag,
			onLeaveTag:this.onLeaveTag,
			onFocus:this.props.onFocus,
			onBlur:this.props.onBlur,
			onClick:this.onClick,
			selections:this.props.selections,
			onKeyPress:this.onKeyPress}});
		delete props.markups;//hide markups from flattenview
		return E(SelectableView,props);
	}

});

module.exports=InterlineView;
},{"./keyboard_mixin":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\keyboard_mixin.js","./selectableview":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\selectableview.js","react-native":"react-native","react/addons":"react/addons"}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\markup2tag.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var typedef=require("./typedef");
var markuputil=require("./markuputil");
var MarkupSelector=require("./markupselector");

/**
	put no conflict markup in object markupActivated
*/
var defaultActiveMarkups=function(gbo,markupActivated) {
	for (var start in gbo){
		var markupcount= Object.keys(gbo[start]).length;
		for (var mid in gbo[start]){
			if (typeof markupActivated[mid]==="undefined") {
				markupActivated[mid]= markupcount===1? true:false;
			}
		}
	}
}

var allDisabled=function(markups,markupActivated) {
	for (var mid in markups) {
		if (markupActivated[mid]) return false;
	}
	return true;
}

var createMarkupSelector=function(start,context,markups) {
	var selector=E(MarkupSelector,{markups:markups,context:context,key:"selector"} );
	return {s:start,l:0,before:selector};
}


var markup2tag=function(markups,context) {
	var gbo=markuputil.groupByOffset(markups);
	defaultActiveMarkups(gbo,context.markupActivated);
	var out=[];
	var createTag=function(mid,showSuper) {
			var m=markups[mid], cls=cls||m.type;
			var Component=typedef[m.type].Component;
			var getStyle=typedef[m.type].getStyle||function(){return {}};
			//console.log("style",context.hovering,getStyle(mid,context),mid)
			var before=E(Component,
							{ mid:mid,showSuper:showSuper,
								hovering:context.hovering===mid,
								editing:context.editing===mid,
								markup:m,context:context,key:mid,
								activated:context.markupActivated[mid]
							}
					);
			return {s:start, l:m.l, mid:mid, before: before, style:getStyle(m,mid,context)};
	}
	for (var i in gbo) {
		var start=parseInt(i), markups=gbo[i];
		var hovering=markups[context.hovering]?context.hovering:null; //this group has hovering markup
		var editing=markups[context.editing]?context.editing:null;    //this group has editing markup
		var markupcount=Object.keys(markups).length;
		var showSuper=true;
		if (!context.editing && markupcount>1 && allDisabled(markups,context.markupActivated )) {
			showSuper=false;
			out.push(createMarkupSelector(start,context,markups));
		}
		if (editing||hovering) {
			out.push(createTag(editing||hovering,showSuper));
		} else {
			for (var mid in markups) {
				out.push(createTag(mid, showSuper && (context.markupActivated[mid]||markupcount===1)));
			}
		}
	}
	
	return out;
}


module.exports=markup2tag;
},{"./markupselector":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\markupselector.js","./markuputil":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\markuputil.js","./typedef":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\typedef.js","react":"react"}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\markupselector.js":[function(require,module,exports){
try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;
var IL=require("./interline");
var handlerStyle={borderStyle:"solid",borderColor:"gray",fontSize:"50%",color:"silver",borderWidth:2
			,borderRadius:"20%",cursor:"pointer",verticalAlign:"top",
			backgroundColor:"drakgray",height:"0.5em",width:"0.5em"};
var handlerStyle_hover=update(handlerStyle,{$merge:{borderColor:"brown"}});

var MarkupSelector=React.createClass({
	mixins:[PureRenderMixin]
	,propTypes:{
		markups:PT.object.isRequired
		,context:PT.object.isRequired
	}
	,onClick:function(e) {
		var mid=e.target.dataset.mid;
		var act=this.props.activated?"deactivate":"activate_edit";
		this.props.context.action(act,mid);
	}
	,renderHandlers:function() {
		var out=[];
		for (var mid in this.props.markups) {
			var m=this.props.markups[mid];
			var hovering=this.props.context.hovering===mid;
			var style=hovering?handlerStyle_hover:handlerStyle;
			out.push(E("span",{"data-mid":mid,onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave,
			onClick:this.onClick, key:mid,style:style},m.username||m.author));
		}
		return out;
	}
	,onMouseEnter:function(e) {
		clearTimeout(this.leavetimer);
		var mid=e.target.dataset.mid;
		this.props.context.action("enter",mid);
	}
	,onMouseLeave:function() {
		var action=this.props.context.action;
		action("leave");//have to leave immediately as parent might be destroyed
	}
	,renderHandler:function() {
		if (this.props.markups[this.props.context.hovering]) {
			return E("span",{},this.renderHandlers());
		} else {
			var mid=Object.keys(this.props.markups)[0];
			var markupcount=Object.keys(this.props.markups).length;
			return E("span",{"data-mid":mid,
				style:handlerStyle,onMouseEnter:this.onMouseEnter
				,onMouseLeave:this.onMouseLeave},"+"+markupcount);
		}
		
	}
	,render:function() {
		return E(IL.Container,{},
				 E(IL.Super, {},this.renderHandler() )
			);
	}
});
module.exports=MarkupSelector;
},{"./interline":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\interline.js","react-native":"react-native","react/addons":"react/addons"}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\markuputil.js":[function(require,module,exports){
/**
	input : { markupid:{markup}, markupid:{markup} }
	return { offset: { markupid:{markup} , markupid:{markup}] }	
*/
var groupByOffset=function(markups) {
	var out={};
	for (var id in markups) {
		var m=markups[id];
		if (!out[m.s]) out[m.s]={};
		out[m.s][id]=m;
	}
	return out;
}

var	hasOverlap=function(start,len,markups){
	for (var i in markups) {
		var m=markups[i];
		if (!(m[0]>start+len || m[0]+m[1]<start)) return true;
	}
	return false;
}

var nmarkupAtPos=function(markups,offset) {
    return markups.reduce(function(prev,m){return (m.s===offset)?prev+1:prev },0);
}

// create minimum spans for overlap markup.
// each span holds an array of markups id in props.mid
// this.spreaded is the starting offset of the text snippnet in the span
// markup other than _select_ (the build in classname for selection)
// with len==0 is same as len==1

var spreadMarkup=function(markups){
	if (!markups) return [];
	var out=[];
	for (var n in markups) {
		var m=markups[n];
		for (var j=m.s;j<m.s+m.l+1;j++) {
			if ( (!m.l && m.type!=="_selected_") || j<m.s+m.l ) {
				if (!out[j]) out[j]=[];
				out[j].push(n);
			}
		}
	}
	for (var i=0;i<out.length;i++) {
		out[i]&&out[i].sort(function(a,b){return a-b});
	}
	return out;
}

module.exports={groupByOffset:groupByOffset,nmarkupAtPos:nmarkupAtPos,
	spreadMarkup:spreadMarkup,hasOverlap:hasOverlap};
},{}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\revision\\edit.js":[function(require,module,exports){
try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;
var containerStyle={
	borderBottom:"solid 0.1em green"
}
var inputStyle={
	  backgroundColor: "transparent",
//		textDecoration: "underline",
    outline:0,
    border:0,
    fontSize:"100%",
    fontFamily:"inherit",
    color: "inherit"
}
var RevisionEdit=React.createClass({
	displayName:"RevisionEdit"
	,mixins:[PureRenderMixin]
	,propTypes:{
		editing:PT.bool.isRequired
		,action:PT.func.isRequired
	}
	,setCaret:function() {
		var that=this;
		setTimeout(function(){
			if (!that.refs.input) return;//input destroyed
			var input=that.refs.input.getDOMNode();	
			input.focus();
			clearTimeout(this.blurtimer);
			var val=input.value;
			input.setSelectionRange(val.length,val.length);
		},100);
	}
	,onKeyPress:function(e) {
		if (e.key=="Enter") {
			var input=this.refs.input.getDOMNode();
			this.props.action("setText",input.value);	
		}
	}
	,componentDidMount:function() {
		this.setCaret();
	}
	,componentDidUpdate:function() {
		if (this.props.editing) this.setCaret();
	}	
	,onFocus:function() {
		if (!this.props.editing)  return;
		clearTimeout(this.blurtimer);
	}
	,onBlur:function() {
		if (!this.props.editing)  return;
		var that=this;
		clearTimeout(this.blurtimer);
		this.blurtimer=setTimeout(function(){
			that.props.action("leave");
		},500);
	},
	render:function() {
		var size=this.props.markup.l||1;
		return E("span",{style:containerStyle},E("input",{ref:"input",size:size,style:inputStyle,
			onKeyPress:this.onKeyPress,onFocus:this.onFocus,onBlur:this.onBlur,
			defaultValue:this.props.markup.t}));
	}
});
module.exports=RevisionEdit;
},{"react-native":"react-native","react/addons":"react/addons"}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\revision\\editcontrol.js":[function(require,module,exports){
try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;

var style={fontSize:"35%",borderStyle:"solid",borderColor:"gray",borderRadius:"25%",cursor:"pointer"};
var RevisionEditControl=React.createClass({
	displayName:"RevisionEditControl"
	,mixins:[PureRenderMixin]
	,propTypes:{
		editing:PT.bool.isRequired
		,action:PT.func.isRequired
	}
	,caretprev:function() {
		this.props.action("adjustlen",-1);
	}
	,caretnext:function() {
		this.props.action("adjustlen",1);
	}
	,render:function() {
		return (E("span",{},
				E("a",{key:"prev",onClick:this.caretprev,style:style},"←")
				,E("a",{key:"next",onClick:this.caretnext,style:style},"→")
			)
		);
	}
});

module.exports=RevisionEditControl;
},{"react-native":"react-native","react/addons":"react/addons"}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\revision\\editmode.js":[function(require,module,exports){
try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;

var IL=require("../interline");
var RevisionNote=require("./note");
var RevisionEdit=require("./edit");
var RevisionEditControl=require("./editcontrol");
var caretPos=require("../caretpos");

var RevisionEditMode=React.createClass({
	displayName:"RevisionEditMode"
	,mixins:[PureRenderMixin]
	,style:{display:"none"}
	,propTypes:{
		markup:PT.object.isRequired
		,mid:PT.string.isRequired
		,context:PT.object.isRequired
	}
	,getInitialState:function(){
		return {editNote:false};
	}
	,adjustlen:function(direction) {
		var m=this.props.markup;
		var caretpos=caretPos.create(this.props.context.text.substr(m.s));
		var newlen=direction<0?caretpos.prev(m.l):caretpos.next(m.l);
		this.action("setLength",newlen);
	}
	,action:function(act,p1) {
		if (act==="editNote") {
			console.log("editnote")
			this.setState({editNote:true});
		} else if (act==="leaveNote") {
			console.log("leavenote")
			this.setState({editNote:false});
		} else if (act==="leave") {
			if (!this.state.editNote) {
				this.props.context.action("leave",this.props.mid);
			}
		} else if (act==="setLength") {
			this.props.context.action("setMarkup",this.props.mid,"l",parseInt(p1)||0);
		} else if (act==="setText") {
			this.props.context.action("setMarkup",this.props.mid,"t",p1);
			this.props.context.action("activate",this.props.mid);
			this.props.context.action("leave",this.props.mid);
		} else if (act==="setNote") {
			this.props.context.action("setMarkup",this.props.mid,"note",p1);
		} else if (act==="adjustlen") {
			this.adjustlen(p1);
		}
	}
	,renderNote:function() {
		return E(RevisionNote,
				{note:this.props.markup.note,action:this.action,editing:this.state.editNote
					,mid:this.props.mid,activated:this.props.activated},
				this.props.markup.note);
	}
	,render:function() {
		var props=update(this.props,{$merge:{
			editing:!this.state.editNote,action:this.action}
		});
		return E(IL.Container,{}
			,E(IL.Super, {}, E(RevisionEditControl,props) )
			,E(IL.Embed, {}, E(RevisionEdit,props))
			,E(IL.Sub  , {}, this.renderNote() )
			);
	}
});
module.exports=RevisionEditMode;
},{"../caretpos":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\caretpos.js","../interline":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\interline.js","./edit":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\revision\\edit.js","./editcontrol":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\revision\\editcontrol.js","./note":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\revision\\note.js","react-native":"react-native","react/addons":"react/addons"}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\revision\\index.js":[function(require,module,exports){
try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;

var IL=require("../interline");
var RevisionNote=require("./note");
var RevisionEditMode=require("./editmode");
var redlinethrough=require("./redlinethrough");
var authorButtonStyle={
			borderStyle:"solid",borderColor:"gray",fontSize:"50%",color:"silver",borderWidth:2
			,borderRadius:"20%",cursor:"pointer",verticalAlign:"top",
			backgroundColor:"drakgray",height:"0.5em",width:"0.5em"};

var AuthorButton=React.createClass({
	mixins:[PureRenderMixin]
	,propTypes:{
		action:PT.func.isRequired
		,mid:PT.string.isRequired
		,activated:PT.bool.isRequired
		,editable:PT.bool.isRequired
	}
	,activatedStyle: update(authorButtonStyle,{$merge:{borderColor:"green"}})
	,getInitialState:function() {
		return {style:{}};
	}
	,onMouseLeave:function(e) {
		this.props.action("leave",this.props.mid);
	}
	,onClick:function(e) {
		var act=this.props.activated?"deactivate":"activate_edit";
		this.props.action(act,this.props.mid);
	}
	,onMouseEnter:function(e) {
		this.props.action("enter",this.props.mid);
	}
	,render:function(){
		return E("span",{style:this.props.activated?this.activatedStyle:authorButtonStyle,
			onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave,onClick:this.onClick},
			this.props.children);
	}
});


var Revision=React.createClass({
	displayName:"Revision"
	,mixins:[PureRenderMixin]
	,style:{display:"none"}
	,propTypes:{
		markup:PT.object.isRequired
		,mid:PT.string.isRequired
		,context:PT.object.isRequired
		,activated:PT.bool
		,showSuper:PT.bool
	}
	,renderAuthor:function() {
		if (this.props.showSuper) {
			return E(AuthorButton,
				{action:this.props.context.action,mid:this.props.mid
				,activated:this.props.activated,editable:this.props.editable||false},
				this.props.markup.username||this.props.markup.author)
		};
	}
	,renderNote:function() {
		if(this.props.hovering) {
			return E(RevisionNote,
				{editing:false,action:this.props.context.action,note:this.props.markup.note,
				 mid:this.props.mid},
				this.props.markup.note);
		};
	}
	,getNewTextStyle:function() {
		var style={display:"none"};
		if (this.props.hovering) style={borderBottom:"solid 0.1em green",display:"inline"};
		else if (this.props.activated) style={display:"inline"};
		return style;
	}
	,render:function() {
		if (this.props.context.editing===this.props.mid) {
			return E(RevisionEditMode,this.props);
		} else {
		 return E(IL.Container,{}
			,E(IL.Super, {}, this.renderAuthor() )
			,E(IL.Embed, {style:this.getNewTextStyle() }, this.props.markup.t)
			,E(IL.Sub  , {}, this.renderNote() )
			);
		}
	}
});
var linethroughstyle={background:"url("+redlinethrough+") repeat center"};
//var linethroughstyle={textDecoration:"line-through"};
var getOldTextStyle=function(markup,mid,context) {
	var style={};
	if (context.hovering===mid) style=linethroughstyle;
	else if (context.editing===mid) style=linethroughstyle;
	else if (context.markupActivated[mid]) style={display:"none"};
	if (markup.l==0) style={};
	return style;
}
module.exports={Component:Revision, getStyle:getOldTextStyle } ;
},{"../interline":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\interline.js","./editmode":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\revision\\editmode.js","./note":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\revision\\note.js","./redlinethrough":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\revision\\redlinethrough.js","react-native":"react-native","react/addons":"react/addons"}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\revision\\note.js":[function(require,module,exports){
try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;

var textareaStyle={top:"0.6em",lineHeight:"100%",fontSize:"75%",position:"absolute",outline:"none",borderRadius:"5px"};
var staticStyle={fontSize:"75%",cursor:"pointer"};
var RevisionNote=React.createClass({
	displayName:"RevisionNote"
	,mixins:[PureRenderMixin]
	,propTypes:{
		action:PT.func.isRequired
		,mid:PT.string.isRequired
		,editing:PT.bool.isRequired
		,note:PT.string.isRequired
	}
	,onBlur:function(){
		this.props.action("setNote",this.refs.note.getDOMNode().value);
		this.props.action("leaveNote");
	}
	,componentDidUpdate:function() {
		if (!this.props.editing) return;
		var that=this;
		setTimeout(function(){
				that.refs.note.getDOMNode().focus();
		},200);
	}
	,onClick:function() {
		this.props.action("editNote");
	}
	,render:function(){

		if (this.props.editing) {
			return E("textarea",
				{rows:4,cols:20,ref:"note",onBlur:this.onBlur,style:textareaStyle,
				defaultValue:this.props.note}
			);
		} else{
			return E("span",{style:staticStyle,onClick:this.onClick},this.props.note||"...");	
		}
	}
});

module.exports=RevisionNote;
},{"react-native":"react-native","react/addons":"react/addons"}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\revision\\redlinethrough.js":[function(require,module,exports){
var redline="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACVBMVEUAAADtHCT///+jR4VkAAAAAXRSTlMAQObYZgAAAAFiS0dEAmYLfGQAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAXSURBVDjLY2AYBcMWhKIBqgiMglGAAAAfDRqRFmX93gAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNS0wNS0yMFQwNzo1NTo0OCswMjowMCznXDoAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTUtMDUtMjBUMDc6NTU6NDgrMDI6MDBduuSGAAAAAElFTkSuQmCC";
//var messy="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAKJSURBVGhD1ZhBbtwwDEWdK3Td7Nr7H6jLrpsrTAV8g6OhSJqkKI/yFkWKSvR7jAdB+vF4PI7vzHYBX5+/z6+O48ffP+dXOlsE9NI9+wZoxoRHHdwXcCkN/OpgbYBTGkTVwZIA+51m/5rzJsoCbGlQqw4KAkR1JrdCHSQDPNKN8VihOvAGiMbEW9SBFRCVBuxWwlt8rjaHBxjStsrMyu1NEeLAl4CcROLWpTFNoJPazLUf4h5berzbnzcmxwI0CfEBUeMep33DGzDalEsTNMRz/iLA421IO42JfpTzrhwgOvUTC6UBG+gfwgNGM5pVLg3S6uAM0LwXSYNJdVz/+PfzF/7uYV4a5NTFbV4HVEmDqLooTbTrPKBWtyekrnmPt86Add4Nv7rorZ3HYe8Pshwz6vZO6fySAL9N1LvRX2mHiwNCQuzwpXqD2bc/ywJCNqOHjTG8ICC6yJA9G95gV6YCouoNuhJV185nAi63ouG0D+0lFpBWb3jsQ+ogENBP93sD235mL9cBia0wDPsZdWAFzE8HmMPuzu8FqAH9A9LTQR9QtRRCCChUB6M0KBnOA8rtGyygaix4Bnw7dXAG1Nozb2JVAD1vhTpm1i6o5xkwM1fz7hnPpOmX8vydOBfgUWcUljTyvxMzj1z/CMa2ac7Ol/+VcEoUqoe+G2LVy4f4Hi63q22kv0Vn5J8Dd+L8BpIeO/8M0BC770fTsAI2USfEd0QNcNqLQyexl8WeKAfQIZq1QnQGEhMCoq7lb5dTAM/lAcblctEEvZ4rYAdpoImpH+J9sHe6b8D4Mouvw44BTnWwV0DiE7hFQGjljHcGjN4Nvzp4T8DMyhl3ByTecptbA8R3xomcehz/AYPHXX9v/QOyAAAAAElFTkSuQmCC";
//var mesh="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAKCAIAAAARhxgeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAVSURBVBhXYwCC////gzEEkM5jYAAAFmgd41TlhHAAAAAASUVORK5CYII=";
module.exports=redline;
},{}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\selectableview.js":[function(require,module,exports){
/*
	Select text by mouse or keyboard
*/
try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;

var selectedTextStyle={"backgroundColor":"highlight",color:"black"};

var KeyboardMixin=require("./keyboard_mixin");
var selection=require("./selection");
var FlattenView=require("./flattenview");
var textrange=require("./textrange");
var selection=require("./selection");
var SelectableView=React.createClass({
	mixins:[PureRenderMixin,KeyboardMixin]
	,propTypes:{
		selectable: PT.oneOf(['no', 'single', 'multiple'])
		,showCaret:PT.bool
		,onSelectText: PT.func
		,tags:PT.array
		,selections:PT.array
		,allowKeys:PT.array
		,onMouseUp:PT.func
		,onSpanEnter:PT.func,onSpanLeave:PT.func
	}
	,updateSelection:function(tags) {
		var seltags=this.tagFromSel(tags||this.state.tags,this.ranges.get());
		this.setState({tags:seltags});
	}
	,setSelections:function(props,tags) {
		if (props.selections) {
			this.ranges.set(props.selections);
			return this.updateSelection(tags);
		}
	}
	,componentWillMount:function() {
		this.ranges=textrange.create();
		this.setSelections(this.props);
	}
	,getInitialState:function(){
		var allowkeys=KeyboardMixin.arrowkeys;
		if (this.props.allowKeys) allowkeys=update(allowkeys,{$push:this.props.allowKeys});
		return {allowkeys:allowkeys,tags:this.props.tags};
	}
	,getDefaultProps:function(){
		return {showCaret:true,selectable:"multiple",tags:[]};
	}
	,componentWillReceiveProps:function(nextProps) {
		var seltags=nextProps.tags;
		if (this.props.selectable!=="no") {
			seltags=this.tagFromSel(seltags,this.ranges.get());	
			this.setState({tags:seltags});
		}
		this.setSelections(nextProps,seltags);
	}
	,componentDidMount:function() {
		//turn contentEditable on for caret, cannot set in render as React will give warning
		if (this.props.showCaret) this.getDOMNode().contentEditable=true;
	}
	,tagFromSel:function(tags,sels) {
		if (!tags)return;
		tags=tags.filter(function(m){ return m.type!=="_selected_";});
		sels.map(function(sel){
			if (sel[1]>0) tags.push({s:sel[0],l:sel[1],type:"_selected_",style:selectedTextStyle});
		});
		return tags;
	}
	,markSelection:function(start,len,selectedtext,params){
		var selectable=this.props.selectable;
		if (selectable==="no") return;

		if (params.ctrlKey&&selectable==="multiple") {
			this.ranges.add(start,len,selectedtext)	
		} else {
			this.ranges.set([[start,len,selectedtext]]);	
		}

		if(this.props.onSelectText){
			var cancel=this.props.onSelectText(start,len,selectedtext,params,this.ranges.get());
			if (cancel) {
					this.ranges.remove(start,len,selectedtext);
			};
		}

		this.updateSelection(this.state.tags);
	}
	,onDoubleClick:function(e) {
		this.onMouseUp(e);
	}
	,removeBlankInselection:function(sel,text) {
		if (text.trim()==="") return;
		var s=0,c=text.charCodeAt(0);
		while (c<0x21 || (c>=0xf0b && c<=0xf0e)) {
			sel.start++;
			sel.len--;
			text=text.substr(1);
			c=text.charCodeAt(0);
		}

		var e=e=text.length-1;
		c=text.charCodeAt(text.length-1);
		while (c<0x21 || (c>=0xf0b && c<=0xf0e)) {
			sel.len--;
			text=text.substr(0,text.length-1);
			c=text.charCodeAt(text.length-1);
		}
		return text;
	}
	,onMouseUp:function(e) {
		if (e.target.nodeName!="SPAN") return;
		var sel=selection.get(this.getDOMNode());
		if (!sel || isNaN(sel.start))return;

		if (sel.len) sel.selection.empty();
		var text=this.props.text.substr(sel.start,sel.len||1);
		if (text.charCodeAt(0)>=0xD800 ) { //surrogate
			text=this.props.text.substr(sel.start,sel.len||2);
		}
		text=this.removeBlankInselection(sel,text);
		var cancel=sel&&this.markSelection(sel.start,sel.len,text,
			{ctrlKey:e.ctrlKey,shiftKey:e.shiftKey,sender:this.props.id});
		if (!cancel) this.selection=sel;
		if (sel.len==0) {
			this.caretPos=sel.start;
		}
	}
	,setCaretPos:function(domnode,offset) {
		var range = document.createRange();
		if (offset<0 || offset>domnode.length)return;
		range.setStart(domnode,offset);
		range.setEnd(domnode,offset);
		 
		var sel = window.getSelection(); 
		sel.removeAllRanges();
		sel.addRange(range); 
	}
	,restoreCaret:function(p) {
		var nodes=this.getDOMNode().childNodes;

		for (var i=nodes.length-1;i>0;i--) {
			var start=parseInt(nodes[i].dataset.start);
			if (start<=p) {
				offset=p-start;
				this.setCaretPos(nodes[i].childNodes[0],offset);
				return;
			}
		}
	}
	,componentDidUpdate:function() {
		if (!this.caretPos) return;
		this.restoreCaret(this.caretPos);
		this.caretPos=0;
	}
	,onFocus:function(e){
	}
	,onBlur:function(e){
	}	
	,render:function(){
		var props=update(this.props,{$merge:{
			onMouseUp:this.onMouseUp
			,onClick:this.props.onClick
			,onSpanEnter:this.props.onSpanEnter
			,onSpanLeave:this.props.onSpanLeave
			,onKeyDown:this.props.onKeyDown||this.onkeydown
			,onKeyUp:this.props.onKeyUp||this.onkeyup
			,onKeyPress:this.props.onKeyPress||this.onkeypress
			,onDoubleClick:this.onDoubleClick
			,onFocus:this.props.onFocus||this.onFocus
			,onBlur:this.props.onBlur||this.onBlur			
			,tags:this.state.tags
		}});
		
		return E(FlattenView,props);
	}
});
module.exports=SelectableView;
},{"./flattenview":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\flattenview.js","./keyboard_mixin":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\keyboard_mixin.js","./selection":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\selection.js","./textrange":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\textrange.js","react-native":"react-native","react/addons":"react/addons"}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\selection.js":[function(require,module,exports){
/**
    Return text position at system caret 
    @param {object} DOM node holding the text
    @param {object} baseNode or extendNode node return by system getSelection
    @param {number} offset from the selected node
*/
var getPos=function(rootele,node,off){
    if (!node) return;
    while (node && node.parentElement!==rootele) node=node.parentElement;
    while (node && !node.dataset.start) node=node.nextSibling;
    if (!node) return -1;

    var pos=parseInt(node.dataset.start)+off;
    return pos;
}
/**
    Return the span and offset containing the pos (return by getPos)
    @param {array} spans
    @param {number} text position
*/
var posInSpan=function(children,pos) {
    var lasti;
	for (var i=0;i<children.length;i++) {
        if (!children[i].dataset.start)continue;
		var spanstart=parseInt(children[i].dataset.start);
		if (spanstart>pos) {
			laststart=parseInt(children[lasti].dataset.start);
			return {idx:i-1,element:children[lasti], offset:pos-laststart};
		}
        lasti=i;
	}
	laststart=parseInt(children[children.length-1].dataset.start);
	return {idx:children.length-1,element:children[children.length-1], offset:pos-laststart };
}
/**
    Set Caret to a saved selection
*/
var restore=function(domnode,oldsel) {
    if (!oldsel) return;
	var span=posInSpan(domnode.childNodes,oldsel.start+oldsel.len)
    if (!span) return;
    if (!span.element.childNodes[0])return;

    var range = document.createRange();
    if (span.element.nodeType!==3 && span.element.childNodes[0].nodeType===3) {
    	span.element=span.element.childNodes[0];
    }
    if (span.offset>span.element.length) {
        range.setStart(span.element, 0);
        range.setEnd( span.element, 0);
    } else {
        range.setStart(span.element ,span.offset);
        range.setEnd( span.element,span.offset);        
    }
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}
/**
    Get the start and len of current selection
    @param {object} root domnode holding the text
*/
var get=function(rootele) {
    var sel=window.getSelection();
    if (!sel.baseNode) return;

    var off=getPos(rootele,sel.anchorNode,sel.anchorOffset);
    var off2=getPos(rootele,sel.focusNode,sel.focusOffset);

    var p1=sel.anchorNode.parentElement,p2=sel.focusNode.parentElement;
    if (p1.nodeName!="SPAN"||p2.nodeName!="SPAN") return;

    var start=off,len=off2-off;
    if (len<0) {
        start=off2;
        len=off-off2;
    }
	return {start:start,len:len, selection:sel};
}

module.exports={get:get,restore:restore};
},{}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\textrange.js":[function(require,module,exports){
/**
	Combining multiple range
*/
var create=function() {
	var textrange={};
	var _ranges=[];

	var removeOverlap=function(start,len) {
		var overlap=[];
		_ranges=_ranges.filter(function(r){
			if (r[0]>start+len || r[0]+r[1]<start) return true;
			else {
				overlap.push(r);
				return false;
			}
		});
		return overlap;
	}
	var combine=function(ranges) {
		var start=Number.MAX_VALUE,end=0;
		var text=[];
		for (var i=0;i<ranges.length;i++) {
			var r=ranges[i];

			for (var j=r[0];j<r[0]+r[1];j++) {
				if (!text[j]) text[j]=r[2][j-r[0]]||"";
			}
			if (r[0]<start) start=r[0];
			if (r[0]+r[1]>end) end=r[0]+r[1];
		}
		var t="";
		for (var i=start;i<end;i++) t+=text[i];
		return [start,end-start,t];
	}

	var find=function(start,length) {
		for (var i=0;i<_ranges.length;i++) {
			var r=_ranges[i];
			if (r[0]===start && r[1]===length)return i;
		}
		return -1;
	}
	var add=function(start,len,text) {
		var text=text||"";

		var same=find(start,len);
		if (same>-1) {
			_ranges.splice(same,1);
			return ;
		}
		
		var overlap=removeOverlap(start,len);

		if (overlap.length) {
			overlap.push([start,len,text]);
			var combined=combine(overlap);
			_ranges.push( combined );
		} else {
			_ranges.push([start,len,text]);	
		}
		_ranges.sort(function(s1,s2){ //sort by start and len
			return (s1[0]==s2[0])?(s1[1]-s2[1]):(s1[0]-s2[0]);
		});
	}
	var get=function() {
		return _ranges;
	}
	var removeAll=function() {
		_ranges=[];
	}
	var remove=function(start,len,text) {
		var idx=find(start,len);
		if (idx>-1) {
			_ranges.splice(idx,1);
		}
	}
	var set=function(ranges) {
		removeAll();
		for (var i=0;i<ranges.length;i++) {
			var r=ranges[i];
			add(r[0],r[1],r[2]);
		}
	}
	textrange.add=add;
	textrange.get=get;
	textrange.removeAll=removeAll;
	textrange.remove=remove;
	textrange.set=set;
	textrange.find=find;

	return textrange;
}
var markupInRange=function(markups,ranges) {
	if (!ranges || !ranges.length) return [];
	if (typeof ranges[0]==="number") ranges=[ranges];
	if (ranges.length==0) return [];
	var out=[];
	for (var j=0;j<markups.length;j++) {
		var m=markups[j];
		for (var i=0;i<ranges.length;i++) {
			var r=ranges[i];
			if (m.s>=r[0] && m.s+m.l<=r[0]+r[1] && out.indexOf(m)===-1) {
				out.push(m);
			}
		};
	};
	return out;
}
module.exports={create:create, markupInRange:markupInRange };
},{}],"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\typedef.js":[function(require,module,exports){
var revision=require("./revision");
module.exports={"rev":revision};
},{"./revision":"C:\\ksana2015\\node_modules\\ksana-layer-react\\src\\revision\\index.js"}],"C:\\ksana2015\\node_modules\\ksana2015-segfilter\\index.js":[function(require,module,exports){
var React=require("react/addons");

var E=React.createElement;
var PT=React.PropTypes;
var SegFilter=React.createClass({
	mixins:[React.addons.PureRender]
	,propTypes:{
		"regex":PT.string
		,"texts":PT.object.isRequired
		,"onGoSegment":PT.func
	}
	,getInitialState:function() {
		return {itemindex:0,texts:this.props.texts,match:[],regex:this.props.regex};
	}
	,componentWillMount:function() {
		this.btn=this.props.button||"button";
	}
	,componentDidMount:function() {
		this.filterSeg(this.props.regex);
	}
	,filterSeg:function(tofind) {
		var regex=new RegExp( tofind,"g");
		var hits={};

		for (var id in this.state.texts) {
			this.state.texts[id].replace(regex,function(m){
				var idx=arguments[arguments.length-2];
				if (!hits[id]) hits[id]=[];
				hits[id].push( [idx,m.length]);
			});
		}
		setTimeout(function(){
			this.setState({match:Object.keys(hits), hits:hits, regex:tofind});
			this.goSeg(0);
		}.bind(this),100);
	}
	,goSeg:function(idx) {
		var segname=this.state.match[idx];
		this.setState({itemindex:idx});
		this.refs.match.getDOMNode().selectedIndex=idx;
		this.props.onGoSegment&&this.props.onGoSegment(segname,this.state.hits[segname],this.state.regex);
	}
	,next:function(){
		var itemindex=this.state.itemindex;
		if (itemindex<this.state.match.length-1) itemindex++;
		this.goSeg(itemindex);
	}
	,onKeyPress:function(e) {
		if (e.key=="Enter") {
			this.filterSeg(e.target.value);
		}
	}
	,onSelectItem:function(e) {
		this.goSeg(e.target.selectedIndex);
	}
	,onChange:function(e) {
		var regex=e.target.value;
		clearTimeout(this.timer);
		this.timer=setTimeout(function(){
			this.filterSeg(regex);
		}.bind(this),3000);
	}
	,renderItem:function(item,idx) {
		return E("option",null, item);
	}
	,renderMatch:function() {
			return E("select",{onChange:this.onSelectItem,style:this.props.style,ref:"match"}
				,this.state.match.map(this.renderItem));
	}
	,render : function() {
		return E("span",{}
			,E("input",{size:6,style:this.props.style,
					ref:"regex",defaultValue:this.state.regex,onKeyPress:this.onKeyPress,onChange:this.onChange})
			,this.renderMatch()
			,E(this.btn,{style:this.props.style,onClick:this.next},"↓")
		);
	}
})
module.exports=SegFilter;
},{"react/addons":"react/addons"}],"C:\\ksana2015\\node_modules\\ksana2015-segnav\\index.js":[function(require,module,exports){
var React=require("react/addons");

var E=React.createElement;
var PT=React.PropTypes;
var SegNav=React.createClass({
	mixins:[React.addons.PureRender]
	,propTypes:{
		"segpat":PT.string
		,"value":PT.string
		,"segs":PT.array.isRequired
		,"onGoSegment":PT.func
	}
	,getInitialState:function() {
		return {segs:this.props.segs};
	}
	,componentWillMount:function() {
		this.btn=this.props.button||"button";
		if (this.props.segpat) {
			var regex=new RegExp(this.props.segpat);
			var segnames={};
			this.props.segs.forEach(function(seg){
				var m=seg.match(regex);
				if (m && !segnames[m[1]]) segnames[m[1]]=true;
			});
			var segs=Object.keys(segnames);
			var segnow=segs.indexOf(this.props.value)||0;
			this.setState({segs:segs,segnow:segnow,segname:this.state.segs[segnow]});
		}
	}
	,componentWillReceiveProps:function(nextProps) {
		var idx=nextProps.segs.indexOf(nextProps.value);
		if (idx>-1) {
			this.setState({segnow:idx,segname:this.state.segs[idx]});
		}
		
	}
	,goSeg:function(idx) {
		this.setState({segnow:idx,segname:this.state.segs[idx]});
		this.props.onGoSegment&&this.props.onGoSegment(this.state.segs[idx]);
	}
	,prev:function() {
		var segnow=this.state.segnow;
		if (segnow>0) segnow--;
		this.goSeg(segnow);
	}
	,next:function(){
		var segnow=this.state.segnow;
		if (segnow<this.state.segs.length-1) segnow++;
		this.goSeg(segnow);
	}
	,onKeyPress:function(e) {
		if (e.key=="Enter") {
			var idx=this.state.segs.indexOf(e.target.value);
			if (idx>-1) this.goSeg(idx);
		}
	}
	,onChange:function(e) {
		var segname=e.target.value;
		var idx=this.state.segs.indexOf(segname);
		this.setState({segname:segname});
		clearTimeout(this.timer);
		this.timer=setTimeout(function(){
			if (idx>-1) this.goSeg(idx);
			else {
				this.refs.seg.getDOMNode().value=this.state.segs[this.state.segnow];
			}
		}.bind(this),2000);
	}
	,render : function() {
		return E("span",null,
			E(this.btn,{style:this.props.style,onClick:this.prev,disabled:this.state.segnow==0},"←"),
			E("input",{size:8,style:this.props.style,ref:"seg",value:this.state.segname,onKeyPress:this.onKeyPress,onChange:this.onChange}),
			E(this.btn,{style:this.props.style,onClick:this.next,disabled:this.state.segnow==this.state.segs.length-1},"→")
		);
	}
})
module.exports=SegNav;
},{"react/addons":"react/addons"}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\downloader.js":[function(require,module,exports){

var userCancel=false;
var files=[];
var totalDownloadByte=0;
var targetPath="";
var tempPath="";
var nfile=0;
var baseurl="";
var result="";
var downloading=false;
var startDownload=function(dbid,_baseurl,_files) { //return download id
	var fs     = require("fs");
	var path   = require("path");

	
	files=_files.split("\uffff");
	if (downloading) return false; //only one session
	userCancel=false;
	totalDownloadByte=0;
	nextFile();
	downloading=true;
	baseurl=_baseurl;
	if (baseurl[baseurl.length-1]!='/')baseurl+='/';
	targetPath=ksanagap.rootPath+dbid+'/';
	tempPath=ksanagap.rootPath+".tmp/";
	result="";
	return true;
}

var nextFile=function() {
	setTimeout(function(){
		if (nfile==files.length) {
			nfile++;
			endDownload();
		} else {
			downloadFile(nfile++);	
		}
	},100);
}

var downloadFile=function(nfile) {
	var url=baseurl+files[nfile];
	var tmpfilename=tempPath+files[nfile];
	var mkdirp = require("./mkdirp");
	var fs     = require("fs");
	var http   = require("http");

	mkdirp.sync(path.dirname(tmpfilename));
	var writeStream = fs.createWriteStream(tmpfilename);
	var datalength=0;
	var request = http.get(url, function(response) {
		response.on('data',function(chunk){
			writeStream.write(chunk);
			totalDownloadByte+=chunk.length;
			if (userCancel) {
				writeStream.end();
				setTimeout(function(){nextFile();},100);
			}
		});
		response.on("end",function() {
			writeStream.end();
			setTimeout(function(){nextFile();},100);
		});
	});
}

var cancelDownload=function() {
	userCancel=true;
	endDownload();
}
var verify=function() {
	return true;
}
var endDownload=function() {
	nfile=files.length+1;//stop
	result="cancelled";
	downloading=false;
	if (userCancel) return;
	var fs     = require("fs");
	var mkdirp = require("./mkdirp");

	for (var i=0;i<files.length;i++) {
		var targetfilename=targetPath+files[i];
		var tmpfilename   =tempPath+files[i];
		mkdirp.sync(path.dirname(targetfilename));
		fs.renameSync(tmpfilename,targetfilename);
	}
	if (verify()) {
		result="success";
	} else {
		result="error";
	}
}

var downloadedByte=function() {
	return totalDownloadByte;
}
var doneDownload=function() {
	if (nfile>files.length) return result;
	else return "";
}
var downloadingFile=function() {
	return nfile-1;
}

var downloader={startDownload:startDownload, downloadedByte:downloadedByte,
	downloadingFile:downloadingFile, cancelDownload:cancelDownload,doneDownload:doneDownload};
module.exports=downloader;
},{"./mkdirp":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\mkdirp.js","fs":false,"http":false,"path":false}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\html5fs.js":[function(require,module,exports){
/* emulate filesystem on html5 browser */
var get_head=function(url,field,cb){
	var xhr = new XMLHttpRequest();
	xhr.open("HEAD", url, true);
	xhr.onreadystatechange = function() {
			if (this.readyState == this.DONE) {
				cb(xhr.getResponseHeader(field));
			} else {
				if (this.status!==200&&this.status!==206) {
					cb("");
				}
			}
	};
	xhr.send();
}
var get_date=function(url,cb) {
	get_head(url,"Last-Modified",function(value){
		cb(value);
	});
}
var get_size=function(url, cb) {
	get_head(url,"Content-Length",function(value){
		cb(parseInt(value));
	});
};
var checkUpdate=function(url,fn,cb) {
	if (!url) {
		cb(false);
		return;
	}
	get_date(url,function(d){
		API.fs.root.getFile(fn, {create: false, exclusive: false}, function(fileEntry) {
			fileEntry.getMetadata(function(metadata){
				var localDate=Date.parse(metadata.modificationTime);
				var urlDate=Date.parse(d);
				cb(urlDate>localDate);
			});
		},function(){
			cb(false);
		});
	});
}
var download=function(url,fn,cb,statuscb,context) {
	 var totalsize=0,batches=null,written=0;
	 var fileEntry=0, fileWriter=0;
	 var createBatches=function(size) {
		var bytes=1024*1024, out=[];
		var b=Math.floor(size / bytes);
		var last=size %bytes;
		for (var i=0;i<=b;i++) {
			out.push(i*bytes);
		}
		out.push(b*bytes+last);
		return out;
	 }
	 var finish=function() {
		 rm(fn,function(){
				fileEntry.moveTo(fileEntry.filesystem.root, fn,function(){
					setTimeout( cb.bind(context,false) , 0) ;
				},function(e){
					console.log("failed",e)
				});
		 },this);
	 };
		var tempfn="temp.kdb";
		var batch=function(b) {
		var abort=false;
		var xhr = new XMLHttpRequest();
		var requesturl=url+"?"+Math.random();
		xhr.open('get', requesturl, true);
		xhr.setRequestHeader('Range', 'bytes='+batches[b]+'-'+(batches[b+1]-1));
		xhr.responseType = 'blob';
		xhr.addEventListener('load', function() {
			var blob=this.response;
			fileEntry.createWriter(function(fileWriter) {
				fileWriter.seek(fileWriter.length);
				fileWriter.write(blob);
				written+=blob.size;
				fileWriter.onwriteend = function(e) {
					if (statuscb) {
						abort=statuscb.apply(context,[ fileWriter.length / totalsize,totalsize ]);
						if (abort) setTimeout( cb.bind(context,false) , 0) ;
				 	}
					b++;
					if (!abort) {
						if (b<batches.length-1) setTimeout(batch.bind(context,b),0);
						else                    finish();
				 	}
			 	};
			}, console.error);
		},false);
		xhr.send();
	}

	get_size(url,function(size){
		totalsize=size;
		if (!size) {
			if (cb) cb.apply(context,[false]);
		} else {//ready to download
			rm(tempfn,function(){
				 batches=createBatches(size);
				 if (statuscb) statuscb.apply(context,[ 0, totalsize ]);
				 API.fs.root.getFile(tempfn, {create: 1, exclusive: false}, function(_fileEntry) {
							fileEntry=_fileEntry;
						batch(0);
				 });
			},this);
		}
	});
}

var readFile=function(filename,cb,context) {
	API.fs.root.getFile(filename, {create: false, exclusive: false},function(fileEntry) {
		fileEntry.file(function(file){
			var reader = new FileReader();
			reader.onloadend = function(e) {
				if (cb) cb.call(cb,this.result);
			};
			reader.readAsText(file,"utf8");
		});
	}, console.error);
}

function createDir(rootDirEntry, folders,  cb) {
  // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
  if (folders[0] == '.' || folders[0] == '') {
    folders = folders.slice(1);
  }
  rootDirEntry.getDirectory(folders[0], {create: true}, function(dirEntry) {
    // Recursively add the new subfolder (if we still have another to create).
    if (folders.length) {
      createDir(dirEntry, folders.slice(1),cb);
    } else {
			cb();
		}
  }, cb);
};


var writeFile=function(filename,buf,cb,context){
	var write=function(fileEntry){
		fileEntry.createWriter(function(fileWriter) {
			fileWriter.write(buf);
			fileWriter.onwriteend = function(e) {
				if (cb) cb.apply(cb,[buf.byteLength]);
			};
		}, console.error);
	}

	var getFile=function(filename){
		API.fs.root.getFile(filename, {exclusive:true}, function(fileEntry) {
			write(fileEntry);
		}, function(){
				API.fs.root.getFile(filename, {create:true,exclusive:true}, function(fileEntry) {
					write(fileEntry);
				});

		});
	}
	var slash=filename.lastIndexOf("/");
	if (slash>-1) {
		createDir(API.fs.root, filename.substr(0,slash).split("/"),function(){
			getFile(filename);
		});
	} else {
		getFile(filename);
	}
}

var readdir=function(cb,context) {
	var dirReader = API.fs.root.createReader();
	var out=[],that=this;
	dirReader.readEntries(function(entries) {
		if (entries.length) {
			for (var i = 0, entry; entry = entries[i]; ++i) {
				if (entry.isFile) {
					out.push([entry.name,entry.toURL ? entry.toURL() : entry.toURI()]);
				}
			}
		}
		API.files=out;
		if (cb) cb.apply(context,[out]);
	}, function(){
		if (cb) cb.apply(context,[null]);
	});
}
var getFileURL=function(filename) {
	if (!API.files ) return null;
	var file= API.files.filter(function(f){return f[0]==filename});
	if (file.length) return file[0][1];
}
var rm=function(filename,cb,context) {
	var url=getFileURL(filename);
	if (url) rmURL(url,cb,context);
	else if (cb) cb.apply(context,[false]);
}

var rmURL=function(filename,cb,context) {
	webkitResolveLocalFileSystemURL(filename, function(fileEntry) {
		fileEntry.remove(function() {
			if (cb) cb.apply(context,[true]);
		}, console.error);
	},  function(e){
		if (cb) cb.apply(context,[false]);//no such file
	});
}
function errorHandler(e) {
	console.error('Error: ' +e.name+ " "+e.message);
}
var initfs=function(grantedBytes,cb,context) {
	webkitRequestFileSystem(PERSISTENT, grantedBytes,  function(fs) {
		API.fs=fs;
		API.quota=grantedBytes;
		readdir(function(){
			API.initialized=true;
			cb.apply(context,[grantedBytes,fs]);
		},context);
	}, errorHandler);
}
var init=function(quota,cb,context) {
	navigator.webkitPersistentStorage.requestQuota(quota,
			function(grantedBytes) {
				initfs(grantedBytes,cb,context);
		}, errorHandler
	);
}
var queryQuota=function(cb,context) {
	var that=this;
	navigator.webkitPersistentStorage.queryUsageAndQuota(
	 function(usage,quota){
			initfs(quota,function(){
				cb.apply(context,[usage,quota]);
			},context);
	});
}
var API={
	init:init
	,readdir:readdir
	,checkUpdate:checkUpdate
	,rm:rm
	,rmURL:rmURL
	,getFileURL:getFileURL
	,writeFile:writeFile
	,readFile:readFile
	,download:download
	,get_head:get_head
	,get_date:get_date
	,get_size:get_size
	,getDownloadSize:get_size
	,queryQuota:queryQuota
}
module.exports=API;

},{}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\ksanagap.js":[function(require,module,exports){
var appname="installer";
if (typeof ksana=="undefined") {
	window.ksana={platform:"chrome"};
	if (typeof process!=="undefined" && 
		process.versions && process.versions["node-webkit"]) {
		window.ksana.platform="node-webkit";
	}
}
var switchApp=function(path) {
	var fs=require("fs");
	path="../"+path;
	appname=path;
	document.location.href= path+"/index.html"; 
	process.chdir(path);
}
var downloader={};
var rootPath="";

var deleteApp=function(app) {
	console.error("not allow on PC, do it in File Explorer/ Finder");
}
var username=function() {
	return "";
}
var useremail=function() {
	return ""
}
var runtime_version=function() {
	return "1.4";
}

//copy from liveupdate
var jsonp=function(url,dbid,callback,context) {
  var script=document.getElementById("jsonp2");
  if (script) {
    script.parentNode.removeChild(script);
  }
  window.jsonp_handler=function(data) {
    if (typeof data=="object") {
      data.dbid=dbid;
      callback.apply(context,[data]);    
    }  
  }
  window.jsonp_error_handler=function() {
    console.error("url unreachable",url);
    callback.apply(context,[null]);
  }
  script=document.createElement('script');
  script.setAttribute('id', "jsonp2");
  script.setAttribute('onerror', "jsonp_error_handler()");
  url=url+'?'+(new Date().getTime());
  script.setAttribute('src', url);
  document.getElementsByTagName('head')[0].appendChild(script); 
}


var loadKsanajs=function(){

	if (typeof process!="undefined" && !process.browser) {
		var ksanajs=require("fs").readFileSync("./ksana.js","utf8").trim();
		downloader=require("./downloader");
		ksana.js=JSON.parse(ksanajs.substring(14,ksanajs.length-1));
		rootPath=process.cwd();
		rootPath=require("path").resolve(rootPath,"..").replace(/\\/g,"/")+'/';
		ksana.ready=true;
	} else{
		var url=window.location.origin+window.location.pathname.replace("index.html","")+"ksana.js";
		jsonp(url,appname,function(data){
			ksana.js=data;
			ksana.ready=true;
		});
	}
}

loadKsanajs();

var boot=function(appId,cb) {
	if (typeof appId=="function") {
		cb=appId;
		appId="unknownapp";
	}
	if (!ksana.js && ksana.platform=="node-webkit") {
		loadKsanajs();
	}
	ksana.appId=appId;
	var timer=setInterval(function(){
			if (ksana.ready){
				clearInterval(timer);
				cb();
			}
		});
}


var ksanagap={
	platform:"node-webkit",
	startDownload:downloader.startDownload,
	downloadedByte:downloader.downloadedByte,
	downloadingFile:downloader.downloadingFile,
	cancelDownload:downloader.cancelDownload,
	doneDownload:downloader.doneDownload,
	switchApp:switchApp,
	rootPath:rootPath,
	deleteApp: deleteApp,
	username:username, //not support on PC
	useremail:username,
	runtime_version:runtime_version,
	boot:boot
}
module.exports=ksanagap;
},{"./downloader":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\downloader.js","fs":false,"path":false}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\livereload.js":[function(require,module,exports){
var started=false;
var timer=null;
var bundledate=null;
var get_date=require("./html5fs").get_date;
var checkIfBundleUpdated=function() {
	get_date("bundle.js",function(date){
		if (bundledate &&bundledate!=date){
			location.reload();
		}
		bundledate=date;
	});
}
var livereload=function() {
	if(window.location.origin.indexOf("//127.0.0.1")===-1) return;

	if (started) return;

	timer1=setInterval(function(){
		checkIfBundleUpdated();
	},2000);
	started=true;
}

module.exports=livereload;
},{"./html5fs":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\html5fs.js"}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\mkdirp.js":[function(require,module,exports){
function mkdirP (p, mode, f, made) {
     var path = nodeRequire('path');
     var fs = nodeRequire('fs');
	
    if (typeof mode === 'function' || mode === undefined) {
        f = mode;
        mode = 0x1FF & (~process.umask());
    }
    if (!made) made = null;

    var cb = f || function () {};
    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    fs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirP(path.dirname(p), mode, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, mode, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                fs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, mode, made) {
    var path = nodeRequire('path');
    var fs = nodeRequire('fs');
    if (mode === undefined) {
        mode = 0x1FF & (~process.umask());
    }
    if (!made) made = null;

    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    try {
        fs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), mode, made);
                sync(p, mode, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = fs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

},{}],"C:\\ksana2015\\pnc2015\\index.js":[function(require,module,exports){
var React=require("react");
require("ksana2015-webruntime/livereload")(); 
var ksanagap=require("ksana2015-webruntime/ksanagap");
ksanagap.boot("pnc2015",function(){
	var Main=React.createElement(require("./src/main.jsx"));
	ksana.mainComponent=React.render(Main,document.getElementById("main"));
});
},{"./src/main.jsx":"C:\\ksana2015\\pnc2015\\src\\main.jsx","ksana2015-webruntime/ksanagap":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\ksanagap.js","ksana2015-webruntime/livereload":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\livereload.js","react":"react"}],"C:\\ksana2015\\pnc2015\\src\\actions\\sourcetext.js":[function(require,module,exports){
module.exports=require("reflux").createActions(["fetch"]);
},{"reflux":"reflux"}],"C:\\ksana2015\\pnc2015\\src\\main.jsx":[function(require,module,exports){
var React=require("react");
var Controls=require("./views/controls");
var Texts=require("./views/texts");
var maincomponent = React.createClass({displayName: "maincomponent",
  render: function() {
    return React.createElement("div", null, 
    React.createElement(Controls, null), 
    React.createElement(Texts, null)
    );
  }
});
module.exports=maincomponent;
},{"./views/controls":"C:\\ksana2015\\pnc2015\\src\\views\\controls.js","./views/texts":"C:\\ksana2015\\pnc2015\\src\\views\\texts.js","react":"react"}],"C:\\ksana2015\\pnc2015\\src\\stores\\sourcetext.js":[function(require,module,exports){
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
},{"../actions/sourcetext":"C:\\ksana2015\\pnc2015\\src\\actions\\sourcetext.js","dataset":"dataset","reflux":"reflux"}],"C:\\ksana2015\\pnc2015\\src\\views\\controls.js":[function(require,module,exports){
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

var Controls=React.createClass({displayName: "Controls",
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
},{"../actions/sourcetext":"C:\\ksana2015\\pnc2015\\src\\actions\\sourcetext.js","../stores/sourcetext":"C:\\ksana2015\\pnc2015\\src\\stores\\sourcetext.js","ksana2015-segfilter":"C:\\ksana2015\\node_modules\\ksana2015-segfilter\\index.js","ksana2015-segnav":"C:\\ksana2015\\node_modules\\ksana2015-segnav\\index.js","react":"react","react-bootstrap":"react-bootstrap"}],"C:\\ksana2015\\pnc2015\\src\\views\\texts.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var bs=require("react-bootstrap");
var Reflux=require("reflux");
var LinkView=require("ksana-layer-react").LinkView;
var store_sourcetext=require("../stores/sourcetext");

var Texts=React.createClass({displayName: "Texts",
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
},{"../stores/sourcetext":"C:\\ksana2015\\pnc2015\\src\\stores\\sourcetext.js","ksana-layer-react":"C:\\ksana2015\\node_modules\\ksana-layer-react\\index.js","react":"react","react-bootstrap":"react-bootstrap","reflux":"reflux"}]},{},["C:\\ksana2015\\pnc2015\\index.js"])
//# sourceMappingURL=bundle.js.map
