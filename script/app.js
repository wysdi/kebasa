moment.locale('id');  
var Comment = React.createClass({

  render: function() {
    const {...props} = this.props; 

    var image='http://placehold.it/400x300';

    if (props.item.gsx$image.$t)
      image = props.item.gsx$image.$t;
    return (
       <tr>
          <td>{props.item.gsx$name.$t}</td>
          <td>{props.item.gsx$sat.$t}</td>
          <td>{'Rp '+numeral(props.item.gsx$price.$t).format('0,0')}/{props.item.gsx$sat.$t}</td>
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
        this.setState({data: data['feed']['entry'], update: moment().format('LLLL')});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: [], update:''};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};
    return (
          <div id="main">
            <div className="inner">
                <header>
                <h1>Sari Kebasa</h1>
                <p>Update : {this.state.update.toString()}</p>
              </header>
              <h3>Daftar Harga</h3>
              <CommentList data={this.state.data} />
              <section>
                <h2>Get in touch</h2>
                <form method="post" action="#">
                  <div className="field half first">
                    <input type="text" name="name" id="name" placeholder="Name" />
                  </div>
                  <div className="field half">
                    <input type="email" name="email" id="email" placeholder="Email" />
                  </div>
                  <div className="field">
                    <div className="textarea-wrapper"><textarea name="message" id="message" placeholder="Message" rows="1" 
                    style={{overflow: 'hidden', resize: 'none', height: 59+'px'}}></textarea></div>
                  </div>
                  <ul className="actions">
                    <li><input type="submit" value="Send" className="special" /></li>
                  </ul>
                </form>
              </section>
            </div>
              
            
          </div>
    );
  }
});

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
                    <th>Harga</th>
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