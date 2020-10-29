import React from 'react';

class Rank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emoji: ''
        }
    }

    componentDidMount() {
        this.getEmoji(this.props.user.entries)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.entries === this.props.user.entries && prevProps.name === this.props.user.name) {
            return null
        }
        this.getEmoji(this.props.user.entries)
    }

    getEmoji(entries) {
        fetch(`https://yowettqk3f.execute-api.us-east-1.amazonaws.com/prod/rank?rank=${entries}`)
        .then(resp => resp.json())
        .then(data => this.setState({ emoji: data.input }))
    }

    render() {
        const { user } = this.props;
        return (
            <div>
                <div className='white f3'>
                    {`${user.name}, your current rank is...`}
                </div>
                <div className='white f1'>
                    {`${user.entries}`}
                </div>
                <div className='white f3'>
                    {`Rank Badge: ${this.state.emoji}`}
                </div>
            </div>
        );
    }
}

export default Rank;