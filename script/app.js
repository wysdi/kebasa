var Comment = React.createClass({

  render: function() {
    const {...props} = this.props; 

    var image='http://placehold.it/400x300';

    if (props.item.gsx$image.$t)
      image = props.item.gsx$image.$t;
    return (
      <article className="style6" >
          <span className="image">
            <img src={image} alt="" />
          </span>
          <a href="generic.html">
            <h2>{props.item.gsx$name.$t}</h2>
            <div className="content">
              <h1>{props.item.gsx$price.$t}/{props.item.gsx$sat.$t}</h1>
            </div>
          </a>
        </article>
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
        this.setState({data: data['feed']['entry'], update: new Date()});
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
    return (
          <div id="main">
            <div className="inner">
                <header>
                <h1>Harga Sembako Bali</h1>
                <p>Update : {this.state.update.toString()}</p>
              </header>
                  <CommentList data={this.state.data} />
              
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
           <section className="tiles" >
        {commentNodes}
      </section>
    );
  }
});



ReactDOM.render(
  <CommentBox pollInterval={36000} />,
  document.getElementById('wrapper')
);