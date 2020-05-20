import React, {Component} from 'react';
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./sliderComponent"; // example render components - source below

const sliderStyle = {
    position: "relative",
    width: "100%",
    boxSizing: "border-box"
};

let sliderTimeOut;

class TwoSideSlider extends Component {
    constructor(){
        super();
        this.state = {
            domain: [0,1000]
        };
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.domain && nextProps.domain !== this.props.domain){
            this.setState({
                domain: [nextProps.domain.minVal,nextProps.domain.maxVal]
            })

        }
    }

    onUpdate = (value) => {
        clearTimeout(sliderTimeOut);
        sliderTimeOut = setTimeout(()=> { console.log(value);
            this.props.setLoader();
            this.props.sliderChange(value[0],value[1]);
        },1000)
    };
    onChange = () => {

    };
    render() {
        console.log(this.props,"domain -- ",this.state.domain)
        return (
            <div>
                <Slider
                    mode={2}
                    step={10}
                    domain={this.state.domain}
                    rootStyle={sliderStyle}
                    onUpdate={this.onUpdate}
                    onChange={this.onChange}
                    values={this.state.domain}
                    disabled={this.props.disabled}
                >
                    <Rail>
                        {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
                    </Rail>
                    <Handles>
                        {({ handles, getHandleProps }) => (
                            <div className="">
                                {handles.map(handle => (
                                    <Handle
                                        key={handle.id}
                                        handle={handle}
                                        domain={this.state.domain}
                                        getHandleProps={getHandleProps}
                                        disabled={this.props.disabled}
                                    />
                                ))}
                            </div>
                        )}
                    </Handles>
                    <Tracks left={false} right={false}>
                        {({ tracks, getTrackProps }) => (
                            <div className="slider-tracks">
                                {tracks.map(({ id, source, target }) => (
                                    <Track
                                        key={id}
                                        source={source}
                                        target={target}
                                        getTrackProps={getTrackProps}
                                        disabled={this.props.disabled}
                                    />
                                ))}
                            </div>
                        )}
                    </Tracks>
                    <Ticks count={5}
                    disabled={this.props.disabled}>
                        {({ ticks }) => (
                            <div className="slider-ticks">
                                {ticks.map(tick => (
                                    <Tick key={tick.id} tick={tick} count={ticks.length} />
                                ))}
                            </div>
                        )}
                    </Ticks>
                </Slider>
            </div>
        );
    }
}

export default TwoSideSlider;