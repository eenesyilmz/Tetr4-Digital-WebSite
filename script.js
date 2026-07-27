document.addEventListener("DOMContentLoaded", () => {
    const heroLogo = document.querySelector("#heroLogo");
    const navText = document.querySelector("#navText");
    const fullLogo = document.querySelector("#fullLogo");
    const ghost4 = document.querySelector("#ghost4");
    const menu = document.querySelector("#menu");
    const navbar = document.querySelector("#navbar");
    const logo4 = document.querySelector("#logo4");
    const hamburger = document.querySelector("#hamburger");
    const menuLinks = document.querySelectorAll("#menu a");
    const scrollBtn = document.querySelector("#scrollTopBtn");

    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }

    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const hasSeenIntro = false;

    let isIntroFinished = false;

    if (!hasSeenIntro) {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
    }

    ScrollTrigger.addEventListener("refreshInit", () => {
        gsap.set([heroLogo, logo4], { clearProps: "all" });
    });

    if (hasSeenIntro) {
        if (heroLogo) heroLogo.remove();
        gsap.set(navText, { opacity: 0 });
        gsap.set(fullLogo, { opacity: 1 });
        gsap.set(navbar, {
            backdropFilter: "blur(16px)",
            backgroundColor: "rgba(0,12,7,.45)",
            borderBottomColor: "rgba(0,255,135,.08)"
        });
        if (window.innerWidth > 768) {
            gsap.set(menu, { opacity: 1, pointerEvents: "auto", visibility: "visible" });
        } else if (hamburger) {
            hamburger.style.display = "flex";
            hamburger.classList.add("visible");
        }
        const langBtn = document.querySelector("#langToggleBtn");
        if (langBtn) langBtn.classList.add("visible");
        gsap.set("h1", { x: 0, opacity: 1 });
        isIntroFinished = true;
    } else {

        gsap.set(heroLogo, { left: "50%", top: "50%", xPercent: -50, yPercent: -50, opacity: 0 });
        gsap.set(logo4, { opacity: 0 });
        gsap.set(navText, { opacity: 0, x: -350 });
        gsap.set(fullLogo, { opacity: 0 });

        if (window.innerWidth <= 768 && hamburger) {
            gsap.set(hamburger, { display: "flex" });
        } else if (window.innerWidth > 768) {
            gsap.set(menu, { opacity: 0, pointerEvents: "none", visibility: "hidden" });
        }

        gsap.to([heroLogo, logo4], { opacity: 1, duration: 0.3, delay: 0.1 });

        const breathe = gsap.to(heroLogo, {
            scale: 1.04,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        let tl = gsap.timeline({
            delay: 1.5,
            onStart: () => {
                breathe.kill();
                gsap.set(heroLogo, { scale: 1 });
            },
            onComplete: () => {
                isIntroFinished = true;
                document.documentElement.style.overflow = "";
                document.body.style.overflow = "";
                ScrollTrigger.refresh();
            }
        });

        window.addEventListener("scroll", () => {
            if (!isIntroFinished && window.scrollY > 0) {
                window.scrollTo(0, 0);
            }
        });

        tl.call(() => breathe.play())
            .to(navText, { opacity: 1, x: 0, duration: 0.55, ease: "power3.out" }, 0.15)
            .to(heroLogo, {
                x: () => {
                    const ghostRect = ghost4.getBoundingClientRect();
                    const targetCenterX = ghostRect.left + (ghostRect.width / 2);
                    const originX = document.documentElement.clientWidth / 2;
                    return targetCenterX - originX;
                },
                y: () => {
                    const ghostRect = ghost4.getBoundingClientRect();
                    const targetCenterY = ghostRect.top + (ghostRect.height / 2);
                    const originY = window.innerHeight / 2;
                    return targetCenterY - originY;
                },
                scale: () => {
                    const targetWidth = ghost4.offsetWidth;
                    const originalWidth = logo4.offsetWidth;
                    return targetWidth / originalWidth;
                },
                rotation: 360,
                ease: "power3.inOut",
                duration: 1.2,
                onComplete: () => {
                    heroLogo.remove();
                }
            }, 0)
            .set(navText, { opacity: 0 }, 0.98)
            .set(fullLogo, { opacity: 1 }, 0.98)
            .to(navbar, {
                backdropFilter: "blur(16px)",
                backgroundColor: "rgba(0,12,7,.45)",
                borderBottomColor: "rgba(0,255,135,.08)",
                duration: 0.25
            }, 1)
            .add(() => {
                if (window.innerWidth > 768) {
                    gsap.set(menu, { opacity: 1, pointerEvents: "auto", visibility: "visible" });
                } else if (hamburger) {
                    hamburger.style.display = "flex";
                    hamburger.classList.add("visible");
                }
            }, 1)
            .call(() => {
                const langBtn = document.querySelector("#langToggleBtn");
                if (langBtn) langBtn.classList.add("visible");
                if (hamburger && window.innerWidth <= 768) {
                    hamburger.style.display = "flex";
                    hamburger.classList.add("visible");
                }
            }, null, 1)
            .to("h1", {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out"
            }, 1);
    }

    ScrollTrigger.create({
        trigger: "#hero",
        start: "bottom top",
        onEnter: () => {
            if (window.innerWidth > 768) {
                menu.classList.add("fixed-nav");
            }
            if (scrollBtn) scrollBtn.classList.add("visible");
        },
        onLeaveBack: () => {
            if (window.innerWidth > 768) {
                menu.classList.remove("fixed-nav");
            }
            if (scrollBtn) scrollBtn.classList.remove("visible");
        }
    });

    if (scrollBtn) {
        ScrollTrigger.create({
            trigger: ".footer-action",
            start: "top bottom",
            onEnter: () => {
                scrollBtn.classList.add("absolute");
            },
            onLeaveBack: () => {
                scrollBtn.classList.remove("absolute");
            }
        });
    }

    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
        ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => {
                if (self.isActive) {
                    const id = section.getAttribute("id");
                    menuLinks.forEach((link) => {
                        if (link.getAttribute("href") === `#${id}`) {
                            link.classList.add("active-link");
                        } else {
                            link.classList.remove("active-link");
                        }
                    });
                }
            }
        });
    });

    const form = document.querySelector('.idea-form');
    const dynamicLogs = document.getElementById('dynamicLogs');
    const isEnglish = window.location.pathname.includes('en.html');

    if (form && dynamicLogs) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const submitBtn = form.querySelector('.submit-btn');

            submitBtn.textContent = isEnglish ? 'Sending...' : 'Gönderiliyor...';
            submitBtn.disabled = true;

            if (isEnglish) {
                dynamicLogs.innerHTML = `
                    <p class="terminal-line"><span class="prompt">$</span> git add .</p>
                    <p class="terminal-line"><span class="prompt">$</span> git commit -m "feat: new project idea & contact data"</p>
                    <p class="terminal-line muted">[main c3f9a2] 3 files changed, 48 insertions(+)</p>
                    <p class="terminal-line highlight"><span class="prompt">→</span> Encrypting payload (AES-256-GCM)...</p>
                `;
            } else {
                dynamicLogs.innerHTML = `
                    <p class="terminal-line"><span class="prompt">$</span> git add .</p>
                    <p class="terminal-line"><span class="prompt">$</span> git commit -m "feat: yeni proje fikri ve iletişim verileri"</p>
                    <p class="terminal-line muted">[main c3f9a2] 3 dosya değiştirildi, 48 ekleme(+)</p>
                    <p class="terminal-line highlight"><span class="prompt">→</span> Payload şifreleniyor (AES-256-GCM)...</p>
                `;
            }

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.success) {
                    setTimeout(() => {
                        if (isEnglish) {
                            dynamicLogs.innerHTML += `
                                <p class="terminal-line success">✔ Secure connection (TLS 1.3) verified.</p>
                                <p class="terminal-line"><span class="prompt">$</span> tetr4-cli scan --deep-inspect</p>
                                <p class="terminal-line muted">[info] Input data sanitized and syntax parsed.</p>
                                <p class="terminal-line muted">[info] Data packet added to Studio evaluation queue.</p>
                                <p class="terminal-line highlight"><span class="prompt">→</span> SSL Handshake successful. Connecting to remote server...</p>
                                <p class="terminal-line"><span class="prompt">$</span> git push origin main --force</p>
                                <p class="terminal-line success">✔ Your project idea has been successfully pushed and stored in the database!</p>
                                <p class="terminal-line success" style="color: #38bdf8;">⚡ Status: Under review by the Studio team. Waiting for feedback...</p>
                            `;
                        } else {
                            dynamicLogs.innerHTML += `
                                <p class="terminal-line success">✔ Güvenli bağlantı (TLS 1.3) doğrulandı.</p>
                                <p class="terminal-line"><span class="prompt">$</span> tetr4-cli scan --deep-inspect</p>
                                <p class="terminal-line muted">[info] Girdi verileri temizlendi ve syntax analizi yapıldı.</p>
                                <p class="terminal-line muted">[info] Studio değerlendirme kuyruğuna veri paketi eklendi.</p>
                                <p class="terminal-line highlight"><span class="prompt">→</span> SSL Handshake başarılı. Uzak sunucuya bağlanılıyor...</p>
                                <p class="terminal-line"><span class="prompt">$</span> git push origin main --force</p>
                                <p class="terminal-line success">✔ Proje fikriniz başarıyla pushlandı ve veritabanına kaydedildi!</p>
                                <p class="terminal-line success" style="color: #38bdf8;">⚡ Durum: Studio ekibi tarafından inceleniyor. Geri dönüş bekleniyor...</p>
                            `;
                        }
                    }, 700);

                    submitBtn.textContent = isEnglish ? 'Sent!' : 'Gönderildi!';
                    form.reset();

                    setTimeout(() => {
                        if (isEnglish) {
                            dynamicLogs.innerHTML = `
                                <p class="terminal-line"><span class="prompt">$</span> tetr4-cli init --project-idea</p>
                                <p class="terminal-line muted">System ready. Waiting for form data...</p>
                            `;
                            submitBtn.textContent = 'Send';
                        } else {
                            dynamicLogs.innerHTML = `
                                <p class="terminal-line"><span class="prompt">$</span> tetr4-cli init --project-idea</p>
                                <p class="terminal-line muted">Sistem hazır. Form verileri bekleniyor...</p>
                            `;
                            submitBtn.textContent = 'Gönder';
                        }
                        submitBtn.disabled = false;
                    }, 8000);
                } else {
                    const errorMsg = data.message || (isEnglish ? 'An error occurred during submission.' : 'Gönderim sırasında bir hata oluştu.');
                    dynamicLogs.innerHTML += `<p class="terminal-line" style="color: #ff5f56;">✖ ${isEnglish ? 'Error' : 'Hata'}: ${errorMsg}</p>`;
                    alert((isEnglish ? 'Submission failed: ' : 'Gönderim başarısız: ') + errorMsg);
                    submitBtn.textContent = isEnglish ? 'Send' : 'Gönder';
                    submitBtn.disabled = false;
                }
            } catch (error) {
                dynamicLogs.innerHTML += `<p class="terminal-line" style="color: #ff5f56;">✖ ${isEnglish ? 'Network connection lost.' : 'Ağ bağlantısı koptu.'}</p>`;
                alert(isEnglish ? 'A connection error occurred.' : 'Bağlantı hatası oluştu.');
                submitBtn.textContent = isEnglish ? 'Send' : 'Gönder';
                submitBtn.disabled = false;
            }
        });
    }

    if (hamburger && menu) {
        const toggleMenu = () => {
            hamburger.classList.toggle("active");
            menu.classList.toggle("active");

            if (menu.classList.contains("active")) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        };

        hamburger.addEventListener("click", toggleMenu);

        menuLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                menu.classList.remove("active");
                document.body.style.overflow = "";
            });
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                hamburger.classList.remove("active");
                menu.classList.remove("active");
                document.body.style.overflow = "";
            }
        });
    }
});