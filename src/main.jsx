var React=require("react");
var Controls=require("./views/controls");
var Texts=require("./views/texts");
var maincomponent = React.createClass({
  render: function() {
    return <div>
    <Controls/>
    <Texts/>
    </div>;
  }
});
module.exports=maincomponent;