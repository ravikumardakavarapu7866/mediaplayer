import React,{Component} from 'react';
import { withRouter } from 'react-router';


import not from '../../assets/images/404.svg'



class PageNotFound extends Component {
   

    render() {
        
        return (
              <div className="container">
                  <div className="row">
                      <div className="col-12 col-md-12 col-sm-12 col-lg-12 text-center">
                      <img src={not} alt="Logo" className="img-responsive" style={{width:'480px',marginTop:'-55px'}}></img>
                      <h3>Page Not Found</h3>
                      <p className="text-center h6">Make sure the address is correct and the page hasn't moved.</p>
                      </div>
                  </div>
              </div>
                    

                      
                  
                
        )
    }
}

export default withRouter(PageNotFound);
