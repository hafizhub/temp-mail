const inbox = document.getElementById("inbox");
    const displayMail = document.getElementById("display-mail");
    const msgHeader = document.getElementById("msg-header");
    const msgBody = document.getElementById("msg-body");

    function fetchInbox(domain) {
      fetch("https://api.codetabs.com/v1/proxy?quest=" +
        `https://api.catchmail.io/api/v1/mailbox?address=${domain}`)
        .then(res => res.json())
        .then(data => {
          if (!data.messages.length) {
            inbox.innerHTML = `<div class="empty">Inbox empty</div>`;
            return;
          }

          inbox.innerHTML = data.messages.map(m => `
      <div class="inbox-item" data-id="${m.id}">
        <strong>${m.subject || "(No subject)"}</strong><br>
        <small>${m.from}</small>
      </div>
    `).join("");
        });
    }

    document.getElementById("gen-btn").onclick = () => {
      let user = username.value.trim();
      if (!user) return alert("Enter username");

      let mail = `${user}@catchmail.io`;
      localStorage.setItem("tempMail", mail);
      displayMail.textContent = mail;
      fetchInbox(mail);
    };

    inbox.onclick = (e) => {
      let item = e.target.closest(".inbox-item");
      if (!item) return;

      document.querySelectorAll(".inbox-item")
        .forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      let domain = localStorage.getItem("tempMail");
      let id = item.dataset.id;

      fetch(`https://api.codetabs.com/v1/proxy?quest=https://api.catchmail.io/api/v1/message/${id}?mailbox=${domain}`)
        .then(res => res.json())
        .then(data => {
          msgHeader.innerHTML = `<strong>${data.subject || ""}</strong><br><small>${data.from}</small>`;
          msgBody.innerHTML = data.body.html || data.body.text;
        });
    };

    document.getElementById("clear-mail").onclick = () => {
      localStorage.removeItem("tempMail");
      location.reload();
    };

    let saved = localStorage.getItem("tempMail");
    if (saved) {
      displayMail.textContent = saved;
      fetchInbox(saved);
    }