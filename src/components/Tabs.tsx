import * as React from 'react';
import classnames from 'classnames';

import Icon from './Icon';

class Tab extends React.Component<any> {
    render() {
        const classNames = classnames([
            'tab',
            this.props.active ? 'active' : null
        ]);

        return (
            <div 
                className={classNames}
                onClick={() => this.props.selectTab(this.props.index)}
            >
                <Icon
                    name={this.props.tab.icon}
                />
            </div>
        );
    }
}

class TabContent extends React.Component<any> {
    render() {
        return (
            <div className="tab-content">
                {this.props.content}
            </div>
        );
    }
}

export default class Tabs extends React.Component<any> {

    state = {
        selectedIndex: 0
    }
    
    constructor(props: any) {
        super(props);

        this.selectTab = this.selectTab.bind(this);
    }

    selectTab(index: number) {
        this.setState({
            selectedIndex: index
        });
    }

    render() {
        return (
            <div className="tabs">
                <div className="tabs-header">
                    {this.props.tabs.map((tab: any, index: number) => {
                        return (
                            <Tab
                                key={index}
                                index={index}
                                active={index === this.state.selectedIndex}
                                tab={tab}
                                selectTab={this.selectTab}
                            />
                        );
                    })}
                </div>
                <TabContent
                    title={this.props.tabs[this.state.selectedIndex].title}
                    content={this.props.tabs[this.state.selectedIndex].content}
                />
            </div>
        );
    }
}