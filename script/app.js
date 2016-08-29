moment.locale('id');  
var Comment = React.createClass({

  render: function() {
    const {...props} = this.props; 


    return (
       <tr>
          <td>{props.item.gsx$name.$t}</td>
          <td>{props.item.gsx$sat.$t}</td>
          <td>{numeral(props.item.gsx$price.$t).format('0,0')}</td>
        </tr>
    );
  }
});

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    var url = 'https://spreadsheets.google.com/feeds/list/1q8pmdxdsoU-WPFYPYg8M7yePzM8ekh2C2T0xUqhPPP0/od6/public/values?alt=json&amp;callback=displayContent';
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data['feed']['entry'], update: moment().format('LLLL'), loading:false});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: [], update:'', loading: true};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    // setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  componentDidUpdate: function() {
   this.render();
 },

  reloadData: function() {
     this.setState({loading:true});
   this.loadCommentsFromServer();
  },
  render: function() {
    var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};

  const { loading, update, data } = this.state;

    let btnClass = loading ? 'button special' : 'button';
    return (

          <div id="main">
            <div className="inner">
                <header>
                <h1>Harga Sembako</h1>
                <p>Update : {update.toString()}</p>
              </header>
              <h3>Daftar Harga <a href="#" onClick={this.reloadData} className={btnClass} style={{float:'right'}}>Reload</a></h3> 
              {loading ? <h3 style={{textAlign:'center'}}>Loading . . . .</h3> : 
              <div>
                <CommentList data={data} /> 
                
              </div>
              }
            </div>
          </div>
    );
  }
});
// <section>
//                   <b>Hubungi Kami</b>
//                   <p>Jln. Werkudara 1, No 10 <br />
//                   Br. Karangjung, Sembung, Mengwi, Badung <br />
//                   Phone: <strong>082 144 647 512</strong></p>
//                 </section>
var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment, k) {
      return (
        <Comment key={k} item={comment} />
      );
    });
    return (
           <section>
           <div className="table-wrapper">
              <table className="alt">
                <thead>
                  <tr>
                    <th>Komoditi</th>
                    <th>Satuan</th>
                    <th>Harga (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {commentNodes}
                </tbody>

              </table>
            </div>
            </section>
    );
  }
});



ReactDOM.render(
  <CommentBox pollInterval={36000} />,
  document.getElementById('wrapper')
);