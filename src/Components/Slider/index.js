import React, {Component} from 'react';
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./sliderComponent"; // example render components - source below

const sliderStyle = {
    position: "relative",
    width: "100%",
    boxSizing: "border-box"
};

const domain = [100, 400];

let sliderTimeOut;

class TwoSideSlider extends Component {
    state = {
        domain: this.props.domain ? [this.props.domain.minVal,this.props.domain.maxVal]   : [0,400]
    };
    onUpdate = (value) => {
        clearTimeout(sliderTimeOut);
        sliderTimeOut = setTimeout(()=> { console.log(value);
            this.props.setLoader();
            this.props.sliderChange();
        },1000)
    };
    onChange = () => {

    };
    render() {
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
                                        domain={domain}
                                        getHandleProps={getHandleProps}
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
                                    />
                                ))}
                            </div>
                        )}
                    </Tracks>
                    <Ticks count={5}>
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