document.addEventListener("DOMContentLoaded",()=>{
  const opening=document.getElementById("opening");
  const sealButton=document.getElementById("sealButton");
  const bgMusic=document.getElementById("bgMusic");
  const musicToggle=document.getElementById("musicToggle");
  const musicIcon=document.getElementById("musicIcon");
  const musicLabel=document.getElementById("musicLabel");

  function updateMusicButton(){
    if(!bgMusic || !musicToggle) return;
    const playing=!bgMusic.paused;
    musicToggle.classList.toggle("playing",playing);
    musicIcon.textContent=playing ? "♫" : "♪";
    musicLabel.textContent=playing ? "संगीत सुरू" : "संगीत बंद";
  }

  function startMusic(){
    if(!bgMusic) return;
    bgMusic.volume=.55;
    const playPromise=bgMusic.play();
    if(playPromise!==undefined){
      playPromise.then(updateMusicButton).catch(updateMusicButton);
    }
  }

  function openInvitation(){
    if(!opening||opening.classList.contains("opened"))return;
    window.scrollTo({top:0,left:0,behavior:"auto"});
    opening.classList.add("opened");
    document.body.classList.add("invitation-open");

    // The seal tap counts as a user gesture, so browsers can normally start audio here.
    startMusic();

    setTimeout(()=>{
      document.body.classList.remove("locked");
      window.scrollTo({top:0,left:0,behavior:"auto"});
    },430);
  }

  sealButton?.addEventListener("click",openInvitation);

  musicToggle?.addEventListener("click",()=>{
    if(!bgMusic)return;
    if(bgMusic.paused){
      startMusic();
    }else{
      bgMusic.pause();
      updateMusicButton();
    }
  });

  bgMusic?.addEventListener("play",updateMusicButton);
  bgMusic?.addEventListener("pause",updateMusicButton);

  document.querySelectorAll(".scroll-button").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelector(btn.dataset.target)?.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });
    });
  });

  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting)entry.target.classList.add("visible");
    });
  },{threshold:.18});
  document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

  const blurTrigger=document.getElementById("message");

  function updateBlur(){
    if(!blurTrigger)return;
    const threshold=blurTrigger.offsetTop-window.innerHeight*.35;
    document.body.classList.toggle("bg-blur",window.scrollY>=threshold);
  }

  window.addEventListener("scroll",updateBlur,{passive:true});
  updateBlur();
  updateMusicButton();
});
