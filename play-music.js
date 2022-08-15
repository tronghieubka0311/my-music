const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Hai mươi hai",
      singer: "Amee",
      path: "./music/Hai mươi hai.mp3",
      image: "./image/hai-mươi-hai.png"
    },
    {
      name: "Là ai mang nắng đi xa",
      singer: "Yang",
      path: "./music/Là ai mang nắng đi xa.mp3",
      image: "./image/là-ai-mang-nắng-đi-xa.png"
    },
    {
      name: "Lãng quên chiều thu",
      singer: "Gigi Hương Giang",
      path: "./music/Lãng quên chiều thu.mp3",
      image: "./image/lãng-quên-chiều-thu.png"
    },
    {
      name: "Nỗi nhớ mang tên mình",
      singer: "Hoài lâm",
      path: "./music/Nỗi nhớ mang tên mình.mp3",
      image: "./image/nỗi-nhớ-mang-tên-mình.png"
    },
    {
      name: "Tự sự",
      singer: "Orange",
      path: "./music/Tự sự.mp3",
      image: "./image/tự-sự.png"
    },
    {
      name: "Người đáng thương là anh",
      singer: "Only C",
      path: "./music/Người đáng thương là anh.mp3",
      image: "./image/người-đáng-thương-là-anh.png"
    },
    {
      name: "Chạy khỏi thế giới này",
      singer: "Da LAB ft. Phương Ly",
      path: "./music/Chạy khỏi thế giới này.mp3",
      image: "./image/Chạy-khỏi-thế-giới-này.png"
    },
    {
      name: "Bắt cóc con tim remix",
      singer: "Lou Hoàng",
      path: "./music/Bắt cóc con tim remix.mp3",
      image: "./image/Bắt-cóc-con-tim-remix.png"
    },
    {
      name: "Lạc vào trong mơ remix",
      singer: "Only CSimon C X Wuy",
      path: "./music/Lạc vào trong mơ remix.mp3",
      image: "./image/Lạc-vào-trong-mơ-remix.png"
    },
    {
      name: "Anh sẽ đón em remix",
      singer: "Nguyên ft. Trang",
      path: "./music/Anh sẽ đón em remix.mp3",
      image: "./image/Anh-sẽ-đón-em-remix.png"
    },
    {
      name: "Tôi yêu anh từ một ánh nhìn remix",
      singer: "Đắm - Xesi",
      path: "./music/Tôi yêu anh từ một ánh nhìn remix.mp3",
      image: "./image/Tôi-yêu-anh-từ-một-ánh-nhìn-remix.png"
    }
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return ` <div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index="${index}">
            <div class="thumb" 
                style="background-image:url('${song.image}')">
            </div>
            
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div> `;
    });

    playlist.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },

  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lí CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity
    });
    cdThumbAnimate.pause();

    // Xử lí phóng to nhu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;

      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
      cd.style.opacity = newWidth / cdWidth;
    };

    // Xử lí khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    //Khi nhạc được chạy
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi nhạc bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lí khi tua nhạc
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next nhạc
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi prev nhạc
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Random nhạc
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Xử lí lặp lại 1 bài hát
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Xử lí next nhạc khi nhạc end
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        // Xử lí click vào nhạc
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    };
  },

  //
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  // Khi random xong next or prev
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện (DOM Events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();
  }
};

app.start();
