import React, { Component } from 'react';
const axios = require('axios')

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            words: [],                  // ALL WORDS OF THE FILE
            sortedFC: [],               // TOP N SORTED WORDS WITH THIER OCCURENCE
            limit: '',                  // USER INPUT: N
            expandContractions: false   // EXPAND CONTRACTIONS true/false
        }
    }

    handleSubmitFC = (e) => {                         // TRIGGER ON SUBMITING THE INPUT
        e.preventDefault();   
        if(this.state.limit.match(/^[1-9]+$/)){       // INPUT VALIDATION
            axios({
                method: 'post',
                url: 'http://localhost:5001/api/api', // API URL
                data : {
                    limit: this.state.limit,
                    expandContractions: this.state.expandContractions
                }
            })
                .then((response) => {
                    if(response.data.error){               // IF ANY ERROR
                        alert(response.data.error)
                    }
                    this.setState( state => ({
                        ...state,
                        words: response.data.words,        // STORE ALL WORDS FROM RESPONSE
                        sortedFC: response.data.sortedFC   // STORE TOP N SORTED WORDS
                    }))
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {  // INVALID INPUT
            alert('Please enter a positive integer');
            this.setState( state=> ({
                ...state,
                limit: ''
            }))
        }
    }

    render() {
        console.log(this.state)
        if(this.state.sortedFC !== undefined){
            var i = 0;
            var words = this.state.sortedFC.map( w => {  // STORE TOP N SORTED WORDS IN TABULAR VIEW
                i++;
                return  <tr key={i}>
                            <td>{i}</td>
                            <td>{w[0]}</td>
                            <td>{w[1]}</td>
                        </tr>
            })
        } else { // IF ERROR
            words = []
        }
        
        return (
            <div>
                <main role="main">
                    <div className="jumbotron">
                        <div className="container text-center">
                            <h1 className="display-5">Word Frequency Calculator</h1>
                            <p>A frontend to get the top N most frequently occurring words from the file</p>
                            <a href="http://terriblytinytales.com/test.txt" target="_blank" rel="noopener noreferrer"><pre>http://terriblytinytales.com/test.txt</pre></a>
                            <form className="form-inline justify-content-center" onSubmit={this.handleSubmitFC.bind(this)}>
                                <div className="form-group mr-2 mb-2">
                                    <input type="text" className="form-control" id="inputCount" placeholder="Enter number" title="Please enter a positive integer" required pattern="[1-9]+" value={this.state.limit} onChange={(e) => this.setState({limit: e.target.value})}/>
                                </div>
                                <button type="submit" className="btn btn-primary mb-2">Submit</button>
                            </form>
                            <input className="form-check-input" type="checkbox" value="" id="expandContractions" onChange={(e) => this.setState({expandContractions: !this.state.expandContractions})} />
                            <label className="form-check-label" htmlFor="expandContractions">
                                Expand Contractions
                            </label>
                            <br/>
                            <small className="text-muted align-top">(eg. we're => we are)</small>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                            {
                                words.length > 0 ? (  // HIDE TABLE BEFORE FETCHING THE WORDS
                                    <table className="table table-bordered table-striped mb-5">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Word</th>
                                                <th>Occurence</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {words}
                                        </tbody>
                                    </table>
                                ) : ( <></> )
                            }
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default App;
