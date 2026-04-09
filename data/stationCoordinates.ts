/**
 * GPS coordinates for all Moscow Metro, MCC, and MCD stations.
 * Key format: 'lineId-orderNumber' (e.g., '1-01', '5-12', 'D1-05')
 *
 * Lines 1 and 5 use verified real coordinates.
 * All other lines use approximate but realistic coordinates in the Moscow area.
 */

export const stationCoordinates: Record<string, { lat: number; lng: number }> = {
  // ============================================================
  // Line 1 — Sokolnicheskaya (Red Line)
  // ============================================================
  '1-01': { lat: 55.8148, lng: 37.7369 }, // Bulvar Rokossovskogo
  '1-02': { lat: 55.8039, lng: 37.7456 }, // Cherkizovskaya
  '1-03': { lat: 55.7962, lng: 37.7133 }, // Preobrazhenskaya Ploshchad
  '1-04': { lat: 55.7894, lng: 37.6798 }, // Sokolniki
  '1-05': { lat: 55.7803, lng: 37.6661 }, // Krasnoselskaya
  '1-06': { lat: 55.7755, lng: 37.6558 }, // Komsomolskaya
  '1-07': { lat: 55.7685, lng: 37.6491 }, // Krasnye Vorota
  '1-08': { lat: 55.7654, lng: 37.6384 }, // Chistye Prudy
  '1-09': { lat: 55.7607, lng: 37.6259 }, // Lubyanka
  '1-10': { lat: 55.7571, lng: 37.6157 }, // Okhotny Ryad
  '1-11': { lat: 55.7519, lng: 37.6105 }, // Biblioteka imeni Lenina
  '1-12': { lat: 55.7452, lng: 37.6038 }, // Kropotkinskaya
  '1-13': { lat: 55.7354, lng: 37.5934 }, // Park Kultury
  '1-14': { lat: 55.7271, lng: 37.5805 }, // Frunzenskaya
  '1-15': { lat: 55.7225, lng: 37.5623 }, // Sportivnaya
  '1-16': { lat: 55.7103, lng: 37.5593 }, // Vorobyovy Gory
  '1-17': { lat: 55.6927, lng: 37.5344 }, // Universitet
  '1-18': { lat: 55.6772, lng: 37.5057 }, // Prospekt Vernadskogo
  '1-19': { lat: 55.6634, lng: 37.4830 }, // Yugo-Zapadnaya
  '1-20': { lat: 55.6455, lng: 37.4725 }, // Troparyovo
  '1-21': { lat: 55.6338, lng: 37.4440 }, // Rumyantsevo
  '1-22': { lat: 55.6219, lng: 37.4242 }, // Salaryevo
  '1-23': { lat: 55.6013, lng: 37.4098 }, // Filatov Lug
  '1-24': { lat: 55.5910, lng: 37.3995 }, // Prokshino
  '1-25': { lat: 55.5720, lng: 37.3880 }, // Olkhovaya
  '1-26': { lat: 55.5597, lng: 37.3690 }, // Kommunarka
  '1-27': { lat: 55.5445, lng: 37.3555 }, // Potapovo

  // ============================================================
  // Line 2 — Zamoskvoretskaya (Green Line)
  // ============================================================
  '2-01': { lat: 55.8783, lng: 37.4896 }, // Khovrino
  '2-02': { lat: 55.8659, lng: 37.4870 }, // Belomorskaya
  '2-03': { lat: 55.8547, lng: 37.4765 }, // Rechnoy Vokzal
  '2-04': { lat: 55.8399, lng: 37.4869 }, // Vodny Stadion
  '2-05': { lat: 55.8189, lng: 37.4980 }, // Voykovskaya
  '2-06': { lat: 55.8055, lng: 37.5153 }, // Sokol
  '2-07': { lat: 55.8003, lng: 37.5318 }, // Aeroport
  '2-08': { lat: 55.7897, lng: 37.5583 }, // Dinamo
  '2-09': { lat: 55.7770, lng: 37.5822 }, // Belorusskaya
  '2-10': { lat: 55.7699, lng: 37.5963 }, // Mayakovskaya
  '2-11': { lat: 55.7649, lng: 37.6052 }, // Tverskaya
  '2-12': { lat: 55.7579, lng: 37.6186 }, // Teatralnaya
  '2-13': { lat: 55.7418, lng: 37.6296 }, // Novokuznetskaya
  '2-14': { lat: 55.7302, lng: 37.6365 }, // Paveletskaya
  '2-15': { lat: 55.7072, lng: 37.6578 }, // Avtozavodskaya
  '2-16': { lat: 55.6953, lng: 37.6637 }, // Tekhnopark
  '2-17': { lat: 55.6791, lng: 37.6644 }, // Kolomenskaya
  '2-18': { lat: 55.6554, lng: 37.6487 }, // Kashirskaya
  '2-19': { lat: 55.6360, lng: 37.6561 }, // Kantemirovskaya
  '2-20': { lat: 55.6215, lng: 37.6697 }, // Tsaritsyno
  '2-21': { lat: 55.6121, lng: 37.6950 }, // Orekhovo
  '2-22': { lat: 55.5984, lng: 37.7148 }, // Domodedovskaya
  '2-23': { lat: 55.5766, lng: 37.7471 }, // Krasnogvardeiskaya
  '2-24': { lat: 55.5706, lng: 37.7616 }, // Alma-Atinskaya

  // ============================================================
  // Line 3 — Arbatsko-Pokrovskaya (Dark Blue Line)
  // ============================================================
  '3-01': { lat: 55.8547, lng: 37.3528 }, // Pyatnitskoe Shosse
  '3-02': { lat: 55.8454, lng: 37.3617 }, // Mitino
  '3-03': { lat: 55.8353, lng: 37.3812 }, // Volokolamskaya
  '3-04': { lat: 55.8261, lng: 37.3855 }, // Myakinino
  '3-05': { lat: 55.8037, lng: 37.4029 }, // Strogino
  '3-06': { lat: 55.7860, lng: 37.4084 }, // Krylatskoe
  '3-07': { lat: 55.7408, lng: 37.4166 }, // Molodyozhnaya
  '3-08': { lat: 55.7309, lng: 37.4189 }, // Kuntsevskaya
  '3-09': { lat: 55.7293, lng: 37.4708 }, // Slavyansky Bulvar
  '3-10': { lat: 55.7366, lng: 37.5166 }, // Park Pobedy
  '3-11': { lat: 55.7438, lng: 37.5649 }, // Kievskaya
  '3-12': { lat: 55.7479, lng: 37.5836 }, // Smolenskaya
  '3-13': { lat: 55.7522, lng: 37.6012 }, // Arbatskaya
  '3-14': { lat: 55.7566, lng: 37.6222 }, // Ploshchad Revolyutsii
  '3-15': { lat: 55.7578, lng: 37.6596 }, // Kurskaya
  '3-16': { lat: 55.7724, lng: 37.6794 }, // Baumanskaya
  '3-17': { lat: 55.7838, lng: 37.7057 }, // Elektrozavodskaya
  '3-18': { lat: 55.7831, lng: 37.7198 }, // Semyonovskaya
  '3-19': { lat: 55.7876, lng: 37.7497 }, // Partizanskaya
  '3-20': { lat: 55.7891, lng: 37.7809 }, // Izmaylovskaya
  '3-21': { lat: 55.7948, lng: 37.7994 }, // Pervomayskaya
  '3-22': { lat: 55.8098, lng: 37.7986 }, // Shchyolkovskaya

  // ============================================================
  // Line 4 — Filyovskaya (Light Blue Line)
  // ============================================================
  '4-01': { lat: 55.7309, lng: 37.4189 }, // Kuntsevskaya
  '4-02': { lat: 55.7360, lng: 37.4620 }, // Pionerskaya
  '4-03': { lat: 55.7380, lng: 37.4835 }, // Filyovsky Park
  '4-04': { lat: 55.7397, lng: 37.5001 }, // Bagrationovskaya
  '4-05': { lat: 55.7411, lng: 37.5154 }, // Fili
  '4-06': { lat: 55.7407, lng: 37.5342 }, // Kutuzovskaya
  '4-07': { lat: 55.7397, lng: 37.5489 }, // Studencheskaya
  '4-08': { lat: 55.7439, lng: 37.5644 }, // Kievskaya
  '4-09': { lat: 55.7488, lng: 37.5835 }, // Smolenskaya
  '4-10': { lat: 55.7526, lng: 37.6016 }, // Arbatskaya
  '4-11': { lat: 55.7527, lng: 37.6089 }, // Aleksandrovsky Sad
  '4-12': { lat: 55.7498, lng: 37.5418 }, // Vystavochnaya
  '4-13': { lat: 55.7493, lng: 37.5342 }, // Mezhdunarodnaya

  // ============================================================
  // Line 5 — Koltsevaya / Ring Line (Brown)
  // ============================================================
  '5-01': { lat: 55.7756, lng: 37.6557 }, // Komsomolskaya
  '5-02': { lat: 55.7578, lng: 37.6597 }, // Kurskaya
  '5-03': { lat: 55.7421, lng: 37.6530 }, // Taganskaya
  '5-04': { lat: 55.7309, lng: 37.6374 }, // Paveletskaya
  '5-05': { lat: 55.7289, lng: 37.6236 }, // Dobryninskaya
  '5-06': { lat: 55.7286, lng: 37.6115 }, // Oktyabrskaya
  '5-07': { lat: 55.7352, lng: 37.5931 }, // Park Kultury
  '5-08': { lat: 55.7439, lng: 37.5644 }, // Kievskaya
  '5-09': { lat: 55.7598, lng: 37.5775 }, // Krasnopresnenskaya
  '5-10': { lat: 55.7770, lng: 37.5823 }, // Belorusskaya
  '5-11': { lat: 55.7803, lng: 37.6015 }, // Novoslobodskaya
  '5-12': { lat: 55.7812, lng: 37.6325 }, // Prospekt Mira

  // ============================================================
  // Line 6 — Kaluzhsko-Rizhskaya (Orange Line)
  // ============================================================
  '6-01': { lat: 55.8883, lng: 37.6619 }, // Medvedkovo
  '6-02': { lat: 55.8708, lng: 37.6643 }, // Babushkinskaya
  '6-03': { lat: 55.8558, lng: 37.6530 }, // Sviblovo
  '6-04': { lat: 55.8447, lng: 37.6384 }, // Botanichesky Sad
  '6-05': { lat: 55.8199, lng: 37.6413 }, // VDNKh
  '6-06': { lat: 55.8085, lng: 37.6385 }, // Alekseevskaya
  '6-07': { lat: 55.7947, lng: 37.6363 }, // Rizhskaya
  '6-08': { lat: 55.7816, lng: 37.6337 }, // Prospekt Mira
  '6-09': { lat: 55.7725, lng: 37.6323 }, // Sukharevskaya
  '6-10': { lat: 55.7653, lng: 37.6367 }, // Turgenevskaya
  '6-11': { lat: 55.7563, lng: 37.6319 }, // Kitay-gorod
  '6-12': { lat: 55.7412, lng: 37.6258 }, // Tretyakovskaya
  '6-13': { lat: 55.7291, lng: 37.6115 }, // Oktyabrskaya
  '6-14': { lat: 55.7185, lng: 37.6083 }, // Shabolovskaya
  '6-15': { lat: 55.7069, lng: 37.5880 }, // Leninsky Prospekt
  '6-16': { lat: 55.6889, lng: 37.5727 }, // Akademicheskaya
  '6-17': { lat: 55.6780, lng: 37.5626 }, // Profsoyuznaya
  '6-18': { lat: 55.6700, lng: 37.5543 }, // Novye Cheryomushki
  '6-19': { lat: 55.6566, lng: 37.5398 }, // Kaluzhskaya
  '6-20': { lat: 55.6428, lng: 37.5264 }, // Belyayevo
  '6-21': { lat: 55.6326, lng: 37.5194 }, // Konkovo
  '6-22': { lat: 55.6184, lng: 37.5076 }, // Tyoply Stan
  '6-23': { lat: 55.6069, lng: 37.4870 }, // Yasenevo
  '6-24': { lat: 55.6011, lng: 37.4665 }, // Novoyasenevskaya

  // ============================================================
  // Line 7 — Tagansko-Krasnopresnenskaya (Purple Line)
  // ============================================================
  '7-01': { lat: 55.8574, lng: 37.4367 }, // Planernaya
  '7-02': { lat: 55.8506, lng: 37.4427 }, // Skhodnenskaya
  '7-03': { lat: 55.8266, lng: 37.4371 }, // Tushinskaya
  '7-04': { lat: 55.8180, lng: 37.4345 }, // Spartak
  '7-05': { lat: 55.8090, lng: 37.4637 }, // Shchukinskaya
  '7-06': { lat: 55.7935, lng: 37.4937 }, // Oktyabrskoye Pole
  '7-07': { lat: 55.7815, lng: 37.5194 }, // Polezhaevskaya
  '7-08': { lat: 55.7736, lng: 37.5454 }, // Begovaya
  '7-09': { lat: 55.7641, lng: 37.5618 }, // Ulitsa 1905 Goda
  '7-10': { lat: 55.7600, lng: 37.5798 }, // Barrikadnaya
  '7-11': { lat: 55.7660, lng: 37.6048 }, // Pushkinskaya
  '7-12': { lat: 55.7616, lng: 37.6246 }, // Kuznetsky Most
  '7-13': { lat: 55.7563, lng: 37.6319 }, // Kitay-gorod
  '7-14': { lat: 55.7394, lng: 37.6534 }, // Taganskaya
  '7-15': { lat: 55.7313, lng: 37.6665 }, // Proletarskaya
  '7-16': { lat: 55.7251, lng: 37.6860 }, // Volgogradsky Prospekt
  '7-17': { lat: 55.7093, lng: 37.7306 }, // Tekstilshchiki
  '7-18': { lat: 55.7067, lng: 37.7631 }, // Kuzminki
  '7-19': { lat: 55.7165, lng: 37.7920 }, // Ryazansky Prospekt
  '7-20': { lat: 55.7156, lng: 37.8179 }, // Vykhino
  '7-21': { lat: 55.7107, lng: 37.8409 }, // Lermontovsky Prospekt
  '7-22': { lat: 55.6997, lng: 37.8551 }, // Zhulebino
  '7-23': { lat: 55.6749, lng: 37.8581 }, // Kotelniki

  // ============================================================
  // Line 8 — Kalininskaya (Yellow Line)
  // ============================================================
  '8-01': { lat: 55.7412, lng: 37.6258 }, // Tretyakovskaya
  '8-02': { lat: 55.7408, lng: 37.6551 }, // Marksistskaya
  '8-03': { lat: 55.7474, lng: 37.6808 }, // Ploshchad Ilicha
  '8-04': { lat: 55.7518, lng: 37.7071 }, // Aviamotornaya
  '8-05': { lat: 55.7580, lng: 37.7299 }, // Shosse Entuziastov
  '8-06': { lat: 55.7508, lng: 37.7658 }, // Perovo
  '8-07': { lat: 55.7518, lng: 37.8143 }, // Novogireyevo
  '8-08': { lat: 55.7451, lng: 37.8558 }, // Novokosino

  // ============================================================
  // Line 8A — Solntsevskaya (Yellow extension)
  // ============================================================
  '8A-01': { lat: 55.7493, lng: 37.5342 }, // Delovoy Tsentr
  '8A-02': { lat: 55.7366, lng: 37.5166 }, // Park Pobedy
  '8A-03': { lat: 55.7269, lng: 37.5044 }, // Minskaya
  '8A-04': { lat: 55.7071, lng: 37.5177 }, // Lomonosovsky Prospekt
  '8A-05': { lat: 55.6970, lng: 37.5014 }, // Ramenki
  '8A-06': { lat: 55.6894, lng: 37.4816 }, // Michurinsky Prospekt
  '8A-07': { lat: 55.6777, lng: 37.4544 }, // Ozyornaya
  '8A-08': { lat: 55.6601, lng: 37.4347 }, // Govorovo
  '8A-09': { lat: 55.6442, lng: 37.4065 }, // Solntsevo
  '8A-10': { lat: 55.6384, lng: 37.3820 }, // Borovskoe Shosse
  '8A-11': { lat: 55.6275, lng: 37.3575 }, // Pykhtino

  // ============================================================
  // Line 9 — Serpukhovsko-Timiryazevskaya (Grey Line)
  // ============================================================
  '9-01': { lat: 55.8990, lng: 37.5871 }, // Altufyevo
  '9-02': { lat: 55.8842, lng: 37.6009 }, // Bibirevo
  '9-03': { lat: 55.8635, lng: 37.6041 }, // Otradnoe
  '9-04': { lat: 55.8481, lng: 37.5940 }, // Vladykino
  '9-05': { lat: 55.8321, lng: 37.5747 }, // Petrovsko-Razumovskaya
  '9-06': { lat: 55.8188, lng: 37.5753 }, // Timiryazevskaya
  '9-07': { lat: 55.8073, lng: 37.5804 }, // Dmitrovskaya
  '9-08': { lat: 55.7942, lng: 37.5884 }, // Savyolovskaya
  '9-09': { lat: 55.7819, lng: 37.5994 }, // Mendeleyevskaya
  '9-10': { lat: 55.7712, lng: 37.6208 }, // Tsvetnoy Bulvar
  '9-11': { lat: 55.7658, lng: 37.6068 }, // Chekhovskaya
  '9-12': { lat: 55.7508, lng: 37.6095 }, // Borovitskaya
  '9-13': { lat: 55.7346, lng: 37.6181 }, // Polyanka
  '9-14': { lat: 55.7269, lng: 37.6249 }, // Serpukhovskaya
  '9-15': { lat: 55.7094, lng: 37.6228 }, // Tulskaya
  '9-16': { lat: 55.6923, lng: 37.6217 }, // Nagatinskaya
  '9-17': { lat: 55.6734, lng: 37.6108 }, // Nagornaya
  '9-18': { lat: 55.6622, lng: 37.6055 }, // Nakhimovsky Prospekt
  '9-19': { lat: 55.6518, lng: 37.5985 }, // Sevastopolskaya
  '9-20': { lat: 55.6410, lng: 37.6063 }, // Chertanovskaya
  '9-21': { lat: 55.6218, lng: 37.6098 }, // Yuzhnaya
  '9-22': { lat: 55.6113, lng: 37.6035 }, // Prazhskaya
  '9-23': { lat: 55.5963, lng: 37.6008 }, // Ulitsa Akademika Yangelya
  '9-24': { lat: 55.5838, lng: 37.5966 }, // Annino
  '9-25': { lat: 55.5688, lng: 37.5765 }, // Bulvar Dmitriya Donskogo

  // ============================================================
  // Line 10 — Lyublinsko-Dmitrovskaya (Light Green Line)
  // ============================================================
  '10-01': { lat: 55.9123, lng: 37.5609 }, // Fiztekh
  '10-02': { lat: 55.8993, lng: 37.5564 }, // Lianozovo
  '10-03': { lat: 55.8850, lng: 37.5505 }, // Yakhromskaya
  '10-04': { lat: 55.8677, lng: 37.5468 }, // Seligerskaya
  '10-05': { lat: 55.8542, lng: 37.5505 }, // Verkhnie Likhobory
  '10-06': { lat: 55.8399, lng: 37.5711 }, // Okruzhnaya
  '10-07': { lat: 55.8321, lng: 37.5747 }, // Petrovsko-Razumovskaya
  '10-08': { lat: 55.8175, lng: 37.5880 }, // Fonvizinskaya
  '10-09': { lat: 55.8022, lng: 37.5871 }, // Butyrskaya
  '10-10': { lat: 55.7936, lng: 37.6152 }, // Maryina Roshcha
  '10-11': { lat: 55.7816, lng: 37.6138 }, // Dostoyevskaya
  '10-12': { lat: 55.7680, lng: 37.6216 }, // Trubnaya
  '10-13': { lat: 55.7657, lng: 37.6368 }, // Sretensky Bulvar
  '10-14': { lat: 55.7567, lng: 37.6598 }, // Chkalovskaya
  '10-15': { lat: 55.7464, lng: 37.6797 }, // Rimskaya
  '10-16': { lat: 55.7326, lng: 37.6652 }, // Krestyanskaya Zastava
  '10-17': { lat: 55.7182, lng: 37.6769 }, // Dubrovka
  '10-18': { lat: 55.7082, lng: 37.6854 }, // Kozhukhovskaya
  '10-19': { lat: 55.6926, lng: 37.7286 }, // Pechatniki
  '10-20': { lat: 55.6883, lng: 37.7502 }, // Volzhskaya
  '10-21': { lat: 55.6756, lng: 37.7612 }, // Lyublino
  '10-22': { lat: 55.6595, lng: 37.7510 }, // Bratislavskaya
  '10-23': { lat: 55.6497, lng: 37.7432 }, // Maryino
  '10-24': { lat: 55.6325, lng: 37.7438 }, // Borisovo
  '10-25': { lat: 55.6211, lng: 37.7431 }, // Shipilovskaya
  '10-26': { lat: 55.6120, lng: 37.7455 }, // Zyablikovo

  // ============================================================
  // Line 11 — Bolshaya Koltsevaya (BKL, Big Ring Line)
  // ============================================================
  '11-01': { lat: 55.7942, lng: 37.5884 }, // Savyolovskaya
  '11-02': { lat: 55.7922, lng: 37.5597 }, // Petrovsky Park
  '11-03': { lat: 55.7896, lng: 37.5332 }, // TsSKA
  '11-04': { lat: 55.7770, lng: 37.5206 }, // Khoroshyovskaya
  '11-05': { lat: 55.7587, lng: 37.5252 }, // Shelepikha
  '11-06': { lat: 55.7493, lng: 37.5342 }, // Delovoy Tsentr
  '11-07': { lat: 55.7553, lng: 37.4920 }, // Mnyovniki
  '11-08': { lat: 55.7632, lng: 37.4697 }, // Narodnoe Opolchenie
  '11-09': { lat: 55.6894, lng: 37.4816 }, // Michurinsky Prospekt
  '11-10': { lat: 55.6772, lng: 37.5057 }, // Prospekt Vernadskogo
  '11-11': { lat: 55.6730, lng: 37.5412 }, // Novatorskaya
  '11-12': { lat: 55.6722, lng: 37.5664 }, // Vorontsovskaya
  '11-13': { lat: 55.6615, lng: 37.5770 }, // Zyuzino
  '11-14': { lat: 55.6533, lng: 37.5980 }, // Kakhovskaya
  '11-15': { lat: 55.6528, lng: 37.6189 }, // Varshavskaya
  '11-16': { lat: 55.6554, lng: 37.6487 }, // Kashirskaya
  '11-17': { lat: 55.6628, lng: 37.6737 }, // Klenovy Bulvar
  '11-18': { lat: 55.6715, lng: 37.6941 }, // Nagatinsky Zaton
  '11-19': { lat: 55.6926, lng: 37.7286 }, // Pechatniki
  '11-20': { lat: 55.7093, lng: 37.7306 }, // Tekstilshchiki
  '11-21': { lat: 55.7327, lng: 37.7282 }, // Nizhegorodskaya
  '11-22': { lat: 55.7518, lng: 37.7071 }, // Aviamotornaya
  '11-23': { lat: 55.7645, lng: 37.6987 }, // Lefortovo
  '11-24': { lat: 55.7838, lng: 37.7057 }, // Elektrozavodskaya
  '11-25': { lat: 55.7894, lng: 37.6798 }, // Sokolniki
  '11-26': { lat: 55.7947, lng: 37.6363 }, // Rizhskaya
  '11-27': { lat: 55.7936, lng: 37.6152 }, // Maryina Roshcha

  // ============================================================
  // Line 12 — Butovskaya (Light Grey Line)
  // ============================================================
  '12-01': { lat: 55.6011, lng: 37.4665 }, // Bittsevsky Park
  '12-02': { lat: 55.5849, lng: 37.4751 }, // Lesoparkovaya
  '12-03': { lat: 55.5715, lng: 37.4741 }, // Ulitsa Starokachalovskaya
  '12-04': { lat: 55.5601, lng: 37.4840 }, // Bulvar Admirala Ushakova
  '12-05': { lat: 55.5466, lng: 37.4777 }, // Ulitsa Skobelevskaya
  '12-06': { lat: 55.5688, lng: 37.5765 }, // Bulvar Dmitriya Donskogo
  '12-07': { lat: 55.5543, lng: 37.5904 }, // Ulitsa Gorchakova

  // ============================================================
  // Line 14 — MCC (Moscow Central Circle)
  // ============================================================
  '14-01': { lat: 55.8399, lng: 37.5711 }, // Okruzhnaya
  '14-02': { lat: 55.8481, lng: 37.5940 }, // Vladykino
  '14-03': { lat: 55.8447, lng: 37.6384 }, // Botanichesky Sad
  '14-04': { lat: 55.8333, lng: 37.6657 }, // Rostokino
  '14-05': { lat: 55.8195, lng: 37.7002 }, // Belokamennaya
  '14-06': { lat: 55.8148, lng: 37.7369 }, // Bulvar Rokossovskogo
  '14-07': { lat: 55.8035, lng: 37.7487 }, // Lokomotiv
  '14-08': { lat: 55.7936, lng: 37.7771 }, // Izmaylovo
  '14-09': { lat: 55.7722, lng: 37.7451 }, // Sokolinaya Gora
  '14-10': { lat: 55.7580, lng: 37.7299 }, // Shosse Entuziastov
  '14-11': { lat: 55.7399, lng: 37.7233 }, // Andronovka
  '14-12': { lat: 55.7327, lng: 37.7282 }, // Nizhegorodskaya
  '14-13': { lat: 55.7228, lng: 37.7162 }, // Novokhokhlovskaya
  '14-14': { lat: 55.7142, lng: 37.7172 }, // Ugreshskaya
  '14-15': { lat: 55.7182, lng: 37.6769 }, // Dubrovka
  '14-16': { lat: 55.7072, lng: 37.6578 }, // Avtozavodskaya
  '14-17': { lat: 55.6976, lng: 37.6469 }, // ZIL
  '14-18': { lat: 55.6903, lng: 37.6249 }, // Verkhnie Kotly
  '14-19': { lat: 55.7068, lng: 37.6049 }, // Krymskaya
  '14-20': { lat: 55.7069, lng: 37.5880 }, // Ploshchad Gagarina
  '14-21': { lat: 55.7186, lng: 37.5590 }, // Luzhniki
  '14-22': { lat: 55.7407, lng: 37.5342 }, // Kutuzovskaya
  '14-23': { lat: 55.7493, lng: 37.5342 }, // Moskva-City
  '14-24': { lat: 55.7587, lng: 37.5252 }, // Shelepikha
  '14-25': { lat: 55.7770, lng: 37.5206 }, // Khoroshyovo
  '14-26': { lat: 55.7878, lng: 37.5143 }, // Zorge
  '14-27': { lat: 55.8036, lng: 37.5023 }, // Panfilovskaya
  '14-28': { lat: 55.8123, lng: 37.4863 }, // Streshnevo
  '14-29': { lat: 55.8261, lng: 37.4950 }, // Baltiyskaya
  '14-30': { lat: 55.8393, lng: 37.5180 }, // Koptevo
  '14-31': { lat: 55.8493, lng: 37.5545 }, // Likhobory

  // ============================================================
  // Line 15 — Nekrasovskaya (Pink Line)
  // ============================================================
  '15-01': { lat: 55.7327, lng: 37.7282 }, // Nizhegorodskaya
  '15-02': { lat: 55.7265, lng: 37.7560 }, // Stakhanovskaya
  '15-03': { lat: 55.7236, lng: 37.7798 }, // Okskaya
  '15-04': { lat: 55.7138, lng: 37.8009 }, // Yugo-Vostochnaya
  '15-05': { lat: 55.7056, lng: 37.8487 }, // Kosino
  '15-06': { lat: 55.7094, lng: 37.8668 }, // Ulitsa Dmitrievskogo
  '15-07': { lat: 55.7142, lng: 37.8924 }, // Lukhmanovskaya
  '15-08': { lat: 55.7044, lng: 37.9276 }, // Nekrasovka

  // ============================================================
  // MCD-1 — Belorussko-Savyolovsky (Lobnya — Odintsovo)
  // ============================================================
  'D1-01': { lat: 55.9740, lng: 37.4684 }, // Lobnya
  'D1-02': { lat: 55.9567, lng: 37.4500 }, // Sheremetyevskaya
  'D1-03': { lat: 55.9413, lng: 37.4660 }, // Khlebnikovo
  'D1-04': { lat: 55.9339, lng: 37.4797 }, // Vodniki
  'D1-05': { lat: 55.9283, lng: 37.5069 }, // Dolgoprudnaya
  'D1-06': { lat: 55.9171, lng: 37.5205 }, // Novodachnaya
  'D1-07': { lat: 55.9070, lng: 37.5245 }, // Mark
  'D1-08': { lat: 55.8993, lng: 37.5564 }, // Lianozovo
  'D1-09': { lat: 55.8823, lng: 37.5522 }, // Beskudnikovo
  'D1-10': { lat: 55.8672, lng: 37.5504 }, // Degunino
  'D1-11': { lat: 55.8399, lng: 37.5711 }, // Okruzhnaya
  'D1-12': { lat: 55.8321, lng: 37.5747 }, // Petrovsko-Razumovskaya
  'D1-13': { lat: 55.8188, lng: 37.5753 }, // Timiryazevskaya
  'D1-14': { lat: 55.7942, lng: 37.5884 }, // Savyolovskaya
  'D1-15': { lat: 55.7770, lng: 37.5822 }, // Belorusskaya
  'D1-16': { lat: 55.7736, lng: 37.5454 }, // Begovaya
  'D1-17': { lat: 55.7498, lng: 37.5418 }, // Testovskaya
  'D1-18': { lat: 55.7411, lng: 37.5154 }, // Fili
  'D1-19': { lat: 55.7293, lng: 37.4708 }, // Slavyansky Bulvar
  'D1-20': { lat: 55.7309, lng: 37.4189 }, // Kuntsevskaya
  'D1-21': { lat: 55.7261, lng: 37.3928 }, // Rabochy Posyolok
  'D1-22': { lat: 55.7210, lng: 37.3673 }, // Setun
  'D1-23': { lat: 55.7148, lng: 37.3430 }, // Nemchinovka
  'D1-24': { lat: 55.6933, lng: 37.3517 }, // Skolkovo
  'D1-25': { lat: 55.6828, lng: 37.3316 }, // Bakovka
  'D1-26': { lat: 55.6770, lng: 37.2775 }, // Odintsovo

  // ============================================================
  // MCD-2 — Kursko-Rizhsky (Nakhabino — Podolsk)
  // ============================================================
  'D2-01': { lat: 55.8423, lng: 37.1740 }, // Nakhabino
  'D2-02': { lat: 55.8424, lng: 37.2021 }, // Anikeyevka
  'D2-03': { lat: 55.8372, lng: 37.2369 }, // Opalikha
  'D2-04': { lat: 55.8390, lng: 37.2866 }, // Krasnogorskaya
  'D2-05': { lat: 55.8327, lng: 37.3212 }, // Pavshino
  'D2-06': { lat: 55.8330, lng: 37.3490 }, // Penyagino
  'D2-07': { lat: 55.8353, lng: 37.3812 }, // Volokolamskaya
  'D2-08': { lat: 55.8335, lng: 37.4097 }, // Trikotazhnaya
  'D2-09': { lat: 55.8266, lng: 37.4371 }, // Tushinskaya
  'D2-10': { lat: 55.8090, lng: 37.4637 }, // Shchukinskaya
  'D2-11': { lat: 55.8123, lng: 37.4863 }, // Streshnevo
  'D2-12': { lat: 55.8104, lng: 37.5067 }, // Krasny Baltiets
  'D2-13': { lat: 55.8093, lng: 37.5332 }, // Grazhdanskaya
  'D2-14': { lat: 55.8073, lng: 37.5804 }, // Dmitrovskaya
  'D2-15': { lat: 55.7942, lng: 37.5884 }, // Savyolovskaya
  'D2-16': { lat: 55.7936, lng: 37.6152 }, // Maryina Roshcha
  'D2-17': { lat: 55.7947, lng: 37.6363 }, // Rizhskaya
  'D2-18': { lat: 55.7755, lng: 37.6558 }, // Ploshchad Tryokh Vokzalov
  'D2-19': { lat: 55.7578, lng: 37.6596 }, // Kurskaya
  'D2-20': { lat: 55.7474, lng: 37.6808 }, // Serp i Molot
  'D2-21': { lat: 55.7408, lng: 37.6870 }, // Moskva Tovarnaya
  'D2-22': { lat: 55.7340, lng: 37.6803 }, // Kalitniki
  'D2-23': { lat: 55.7228, lng: 37.7162 }, // Novokhokhlovskaya
  'D2-24': { lat: 55.7093, lng: 37.7306 }, // Tekstilshchiki
  'D2-25': { lat: 55.6926, lng: 37.7286 }, // Pechatniki
  'D2-26': { lat: 55.6756, lng: 37.7612 }, // Lyublino
  'D2-27': { lat: 55.6682, lng: 37.7548 }, // Depo
  'D2-28': { lat: 55.6580, lng: 37.7475 }, // Pererva
  'D2-29': { lat: 55.6465, lng: 37.7379 }, // Kuryanovo
  'D2-30': { lat: 55.6368, lng: 37.7254 }, // Moskvorechye
  'D2-31': { lat: 55.6215, lng: 37.6697 }, // Tsaritsyno
  'D2-32': { lat: 55.6092, lng: 37.6723 }, // Pokrovskoye
  'D2-33': { lat: 55.5924, lng: 37.6753 }, // Krasny Stroitel
  'D2-34': { lat: 55.5789, lng: 37.6611 }, // Bittsa
  'D2-35': { lat: 55.5561, lng: 37.5876 }, // Butovo
  'D2-36': { lat: 55.5129, lng: 37.5594 }, // Shcherbinka
  'D2-37': { lat: 55.4906, lng: 37.5186 }, // Ostafyevo
  'D2-38': { lat: 55.4565, lng: 37.5325 }, // Silikatnaya
  'D2-39': { lat: 55.4311, lng: 37.5445 }, // Podolsk

  // ============================================================
  // MCD-3 — Leningradsko-Kazansky (Zelenograd-Kryukovo — Ippodrom)
  // ============================================================
  'D3-01': { lat: 55.9865, lng: 37.1802 }, // Zelenograd-Kryukovo
  'D3-02': { lat: 55.9762, lng: 37.2212 }, // Malino
  'D3-03': { lat: 55.9609, lng: 37.2565 }, // Firsanovskaya
  'D3-04': { lat: 55.9476, lng: 37.2807 }, // Skhodnya
  'D3-05': { lat: 55.9351, lng: 37.3026 }, // Podrezkovo
  'D3-06': { lat: 55.9202, lng: 37.3316 }, // Novopodrezkovo
  'D3-07': { lat: 55.9034, lng: 37.3700 }, // Molzhaninovo
  'D3-08': { lat: 55.8953, lng: 37.4074 }, // Khimki
  'D3-09': { lat: 55.8812, lng: 37.4380 }, // Levoberezhaya
  'D3-10': { lat: 55.8783, lng: 37.4896 }, // Khovrino
  'D3-11': { lat: 55.8697, lng: 37.5089 }, // Grachyovskaya
  'D3-12': { lat: 55.8558, lng: 37.5306 }, // Mosselmash
  'D3-13': { lat: 55.8493, lng: 37.5545 }, // Likhobory
  'D3-14': { lat: 55.8321, lng: 37.5747 }, // Petrovsko-Razumovskaya
  'D3-15': { lat: 55.8195, lng: 37.6119 }, // Ostankino
  'D3-16': { lat: 55.7947, lng: 37.6363 }, // Rizhskaya
  'D3-17': { lat: 55.7880, lng: 37.6638 }, // Mitkovo
  'D3-18': { lat: 55.7838, lng: 37.7057 }, // Elektrozavodskaya
  'D3-19': { lat: 55.7738, lng: 37.7158 }, // Sortirovochnaya
  'D3-20': { lat: 55.7518, lng: 37.7071 }, // Aviamotornaya
  'D3-21': { lat: 55.7399, lng: 37.7233 }, // Andronovka
  'D3-22': { lat: 55.7508, lng: 37.7658 }, // Perovo
  'D3-23': { lat: 55.7429, lng: 37.7853 }, // Plyushchevo
  'D3-24': { lat: 55.7298, lng: 37.8058 }, // Veshnyaki
  'D3-25': { lat: 55.7156, lng: 37.8179 }, // Vykhino
  'D3-26': { lat: 55.7056, lng: 37.8487 }, // Kosino
  'D3-27': { lat: 55.6923, lng: 37.8587 }, // Ukhtomskaya
  'D3-28': { lat: 55.6777, lng: 37.8930 }, // Lyubertsy
  'D3-29': { lat: 55.6678, lng: 37.9060 }, // Panki
  'D3-30': { lat: 55.6555, lng: 37.9261 }, // Tomilino
  'D3-31': { lat: 55.6436, lng: 37.9463 }, // Kraskovo
  'D3-32': { lat: 55.6299, lng: 37.9681 }, // Malakhovka
  'D3-33': { lat: 55.6142, lng: 37.9844 }, // Udelnaya
  'D3-34': { lat: 55.6189, lng: 38.0390 }, // Bykovo
  'D3-35': { lat: 55.6058, lng: 38.0682 }, // Ilyinskaya
  'D3-36': { lat: 55.5932, lng: 38.0898 }, // Otdykh
  'D3-37': { lat: 55.5824, lng: 38.1223 }, // Kratovo
  'D3-38': { lat: 55.5757, lng: 38.1499 }, // Yeseninskaya
  'D3-39': { lat: 55.5580, lng: 38.1782 }, // Fabrichnaya
  'D3-40': { lat: 55.5684, lng: 38.2172 }, // Ramenskoye
  'D3-41': { lat: 55.5610, lng: 38.2450 }, // Ippodrom

  // ============================================================
  // MCD-4 — Kaluzhsko-Nizhegorodsky (Aprelevka — Zheleznodorozhnaya)
  // ============================================================
  'D4-01': { lat: 55.5508, lng: 37.0729 }, // Aprelevka
  'D4-02': { lat: 55.5565, lng: 37.1042 }, // Pobeda
  'D4-03': { lat: 55.5755, lng: 37.1338 }, // Kryokshino
  'D4-04': { lat: 55.5897, lng: 37.1518 }, // Sanino
  'D4-05': { lat: 55.5987, lng: 37.1776 }, // Kokoshkino
  'D4-06': { lat: 55.6018, lng: 37.2075 }, // Tolstopaltsevo
  'D4-07': { lat: 55.6122, lng: 37.2335 }, // Lesnoy Gorodok
  'D4-08': { lat: 55.6154, lng: 37.2865 }, // Vnukovo
  'D4-09': { lat: 55.6366, lng: 37.3321 }, // Michurinets
  'D4-10': { lat: 55.6543, lng: 37.3551 }, // Peredelkino
  'D4-11': { lat: 55.6578, lng: 37.3856 }, // Solnechnaya
  'D4-12': { lat: 55.6617, lng: 37.4052 }, // Meshchyorskaya
  'D4-13': { lat: 55.6684, lng: 37.4337 }, // Ochakovo
  'D4-14': { lat: 55.6780, lng: 37.4593 }, // Aminyevskaya
  'D4-15': { lat: 55.6934, lng: 37.4723 }, // Matveyevskoye
  'D4-16': { lat: 55.7269, lng: 37.5044 }, // Minskaya
  'D4-17': { lat: 55.7366, lng: 37.5166 }, // Poklonnaya
  'D4-18': { lat: 55.7407, lng: 37.5342 }, // Kutuzovskaya
  'D4-19': { lat: 55.7493, lng: 37.5342 }, // Moskva-Siti
  'D4-20': { lat: 55.7770, lng: 37.5822 }, // Belorusskaya
  'D4-21': { lat: 55.7942, lng: 37.5884 }, // Savyolovskaya
  'D4-22': { lat: 55.7936, lng: 37.6152 }, // Maryina Roshcha
  'D4-23': { lat: 55.7947, lng: 37.6363 }, // Rizhskaya
  'D4-24': { lat: 55.7755, lng: 37.6558 }, // Ploshchad Tryokh Vokzalov
  'D4-25': { lat: 55.7578, lng: 37.6596 }, // Kurskaya
  'D4-26': { lat: 55.7474, lng: 37.6808 }, // Serp i Molot
  'D4-27': { lat: 55.7327, lng: 37.7282 }, // Nizhegorodskaya
  'D4-28': { lat: 55.7400, lng: 37.7522 }, // Chukhlinka
  'D4-29': { lat: 55.7468, lng: 37.7717 }, // Kuskovo
  'D4-30': { lat: 55.7518, lng: 37.8143 }, // Novogireyevo
  'D4-31': { lat: 55.7584, lng: 37.8582 }, // Reutov
  'D4-32': { lat: 55.7518, lng: 37.8807 }, // Nikolskoye
  'D4-33': { lat: 55.7465, lng: 37.9069 }, // Saltykovskaya
  'D4-34': { lat: 55.7422, lng: 37.9248 }, // Kuchino
  'D4-35': { lat: 55.7401, lng: 37.9503 }, // Olgino
  'D4-36': { lat: 55.7433, lng: 37.9827 }, // Zheleznodorozhnaya
};

/**
 * Look up GPS coordinates for a station by its ID.
 * @param stationId - Station ID in 'lineId-orderNumber' format (e.g., '1-01', '5-12', 'D1-05')
 * @returns The coordinates object { lat, lng } or null if not found
 */
export function getStationCoords(stationId: string): { lat: number; lng: number } | null {
  return stationCoordinates[stationId] ?? null;
}
