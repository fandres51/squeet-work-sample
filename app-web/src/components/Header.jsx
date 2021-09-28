import './Header.css';

function Header() {
  return (
    <div className="Header">
      <header className="header-box">
        <img src={"/img/logo.png"}  style={{maxHeight: 75}} className="App-logo" alt="logo" />
        <ul className="header-ul">
          <li className="header-li"><a href="https://squeet.co">Home</a></li>
          <li className="header-li"><a href="https://squeet.co/#download">Download</a></li>
          <li className="header-li"><a href="https://squeet.co/blog">Blog</a></li>
        </ul>
        <ul className="header-ul-mobile">
          <li className="header-li"><a href="https://squeet.co">Home</a></li>
          <li className="header-li"><a href="https://squeet.co/#download">Download</a></li>
          <li className="header-li"><a href="https://squeet.co/blog">Blog</a></li>
        </ul>
      </header>
    </div>
  );
}

export default Header;
