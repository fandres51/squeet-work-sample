import './App.css';
import WebSwiper from './components/WebSwiper';
import * as React from 'react';
import axios from 'axios';
import API from './Api';
import Cookies from 'js-cookie';
// import Header from './components/Header';
import VotesPopup from './components/VotesPopup';

function App() {

  const groupId = window.location.pathname.split("/")[2];

  const [group, setGroup] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [screen, setScreen] = React.useState(0);
  const [name, setName] = React.useState("");
  const [showVotes, setShowVotes] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [nameType, setNameType] = React.useState(0);
  const [email, setEmail] = React.useState("");
  const [showingEmail, setShowingEmail] = React.useState(true);
  const [showingTitle, setShowingTitle] = React.useState(true);

  const isEsp = window.location.hostname.startsWith('es.');

  // const [card, setCards] = React.useState([]);

  React.useEffect(function () {
    async function run() {
      try {
        let user;
        if (Cookies.get('squeet_auth')) {
          try {
            user = (await axios.get(API.API_BASE + 'me', { headers: API.AUTH_HEADER() })).data;
            setName(user.name);
            setUser(user);
          } catch (err) {
            console.log(err);
          }
        }
        const resp = await axios.get(API.API_BASE + "groups/" + groupId);
        setGroup(resp.data);
        if (user) {
          document.title = resp.data.name + (isEsp ? " en" : " on") + " Squeet";
          let resultsData = (await axios.get(API.API_BASE + "groups/" + resp.data.id + "/results", { headers: API.AUTH_HEADER() })).data;
          setResults(resultsData);
          setScreen(1);
        } else {
          const title = !isEsp ? "You have been invited to:" : "Has sido invitado a:";
          document.title = title + resp.data.name + (isEsp ? " en" : " on") + " Squeet";
        }
        console.log(resp.data);

      } catch (err) {
        console.log(err);
        if (err.response) {
          alert(err.response.data.error);
        }
      }
    }
    run();
  }, [groupId]);

  async function updateResults() {
    const resultsData = (await axios.get(API.API_BASE + "groups/" + group.id + "/results", { headers: API.AUTH_HEADER() })).data;
    setResults(resultsData);
    console.log(resultsData);
  }

  async function submitName() {
    try {
      if (!user) {
        const resp = await axios.post(API.API_BASE + "web/registerName", { name, group_id: group.id });
        Cookies.set("squeet_auth", resp.data.token);
      } else {
        await axios.post(API.API_BASE + "user/setName", { name, group_id: group.id }, { headers: API.AUTH_HEADER() });
      }
      setScreen(1);
    } catch (err) {
      console.log(err);
    }

  }

  async function submitEmail() {
    // try {
    //   if (!user) {
    //     const resp = await axios.post(API.API_BASE + "web/registerName", { name, group_id: group.id });
    //     Cookies.set("squeet_auth", resp.data.token);
    //   } else {
    //     await axios.post(API.API_BASE + "user/setName", { name, group_id: group.id }, { headers: API.AUTH_HEADER() });
    //   }
    //   setScreen(1);
    // } catch (err) {
    //   console.log(err);
    // }
    alert('Ye you signed up for notifications');
  }

  return (
    <div>
      {
        showVotes &&
        <VotesPopup isEsp={isEsp} card={results !== null ? results[0] : null} close={() => setShowVotes(false)} />
      }
      <div className="App">
        {/* <Header /> */}
        {
          screen === 0 &&
          <>
            <div style={{ textAlign: 'center' }}>
              <img alt="" style={{ width: '100%', maxWidth: 2000 }} src="/img/banner.png" />
              <h2 className="gray" style={{ fontWeight: '400' }}>{!isEsp ? "You have been invited to:" : "Has sido invitado a:"}</h2>
              <h1 style={{ marginTop: -15 }}>{group && group.name}</h1>
              <div className="identificationTypeView">
                <label onClick={() => { setNameType(0); setName(""); }} className={"identificationType" + (nameType === 0 ? " identificationTypeSelected" : "")}>NAME</label>
                <label onClick={() => { setNameType(1); setName("ANONYMOUS"); }} className={"identificationType" + (nameType === 1 ? " identificationTypeSelected" : "")}>ANONYMOUS</label><br />
              </div>
              <br />
              <input disabled={nameType === 1} type="text" className="nameField" placeholder={!isEsp ? "YOUR NAME" : "TU NOMBRE"} value={name} onChange={e => setName(e.target.value)} /><br />
              <button className="goButton" type="submit" onClick={submitName}>
                {isEsp ? "EMPEZAR" : "GO"}
              </button>
            </div>
          </>
        }
        {screen === 1 &&
          <div className="swiperContainer">
            {
              showingTitle &&
              <div className="swipHead">
                <h1 className="swipName">{group && group.name}</h1>
                <p className="swipMessage gray">
                  {
                    !isEsp ? "We will show you the group winner option after you finish voting" :
                      "Te mostraremos la opción ganadora después de que acabes de votar"
                  }
                </p>
              </div>
            }
            <div className="swiper">
              <WebSwiper 
                isEsp={isEsp} 
                group={group} 
                user={user} 
                results={results} 
                doneSwiping={updateResults} 
                showVotes={() => setShowVotes(true)}
                showTitle={setShowingTitle}
                showEmail={setShowingEmail}
            ></WebSwiper>
            </div>
            {
              false &&
              <div style={{ textAlign: 'center' }}>
                <h2 className="gray" style={{ fontWeight: '400' }}>{!isEsp ? "Get notified of new choices added and new results." : "Reciba notificaciones de nuevas opciones agregadas y nuevos resultados."}</h2>
                <input type="text" className="nameField" placeholder={!isEsp ? "YOUR EMAIL" : "TU EMAIL"} value={email} onChange={e => setEmail(e.target.value)} /><br />
                <button className="goButton" type="submit" onClick={submitEmail}>
                  {isEsp ? "REGISTRARSE" : "SIGN UP"}
                </button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  );
}

export default App;
