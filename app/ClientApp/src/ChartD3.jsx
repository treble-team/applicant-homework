import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import chart from "./chart.js";
import * as _ from "lodash";

class ChartD3 extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    let el = this.ref.current;
    chart.create(
      el,
      {
        width: 960,
        height: 500,
      },
      this.getChartState()
    );
  }

  componentDidUpdate() {
    chart.update(this.getChartState());
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextProps.data, this.props.data);
  }

  getChartState() {
    return {
      data: this.props.data,
      chartTitle: this.props.chartTitle,
    };
  }

  componentWillUnmount() {
    let el = ReactDOM.findDOMNode(this);
    chart.cleanUp(el);
  }

  render() {
    return <div className="chart" ref={this.ref}></div>;
  }
}

ChartD3.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
};

export default ChartD3;
