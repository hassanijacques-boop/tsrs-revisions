// Taysīr al-ʿAzīz al-Ḥamīd - Complete Chapter Data
// Adapted from the 66 chapters of Kitāb al-Tawḥīd

const CHAPTERS = [
  {
    id: 1,
    arTitle: "باب فضل التوحيد وما يكفر من الذنوب",
    frTitle: "Le mérite du Tawḥīd et les péchés qu'il efface",
    arNum: "الباب الأول",
    summary: `Ce premier chapitre établit la place centrale du Tawḥīd dans l'Islam. L'auteur, Sulaymān ibn ʿAbdillāh, explique que le Tawḥīd (l'unicité d'Allah) est la plus grande des obligations et la base de toute l'œuvre. Il cite la parole d'Allah : « Ceux qui ont cru et n'ont point voilé leur foi par de l'injustice (shirk), ceux-là ont la sécurité et ils sont bien-guidés » (Sourate al-Anʿām, v. 82). Le Prophète ﷺ a dit : « Quiconque dit : il n'y a de divinité qu'Allah, et mécroit en ce qui est adoré en dehors d'Allah, ses biens et son sang sont inviolables, et son jugement revient à Allah. »`,
    verses: [
      { ar: "الَّذِينَ آمَنُوا وَلَمْ يَلْبِسُوا إِيمَانَهُم بِظُلْمٍ أُولَٰئِكَ لَهُمُ الْأَمْنُ وَهُم مُّهْتَدُونَ", fr: "Ceux qui ont cru et n'ont point voilé leur foi par de l'injustice (shirk), ceux-là ont la sécurité et ils sont bien-guidés.", ref: "Sourate al-Anʿām (6:82)" },
      { ar: "وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا", fr: "Adorez Allah et ne Lui associez rien.", ref: "Sourate an-Nisāʾ (4:36)" }
    ],
    hadiths: [
      { ar: "عَنْ عُبَادَةَ بْنِ الصَّامِتِ رضي الله عنه قَالَ: قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم: «مَنْ قَالَ: لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، وَأَنَّ عِيسَى عَبْدُ اللَّهِ وَرَسُولُهُ...»", fr: "Quiconque atteste qu'il n'y a de divinité qu'Allah, Seul sans associé, que Muḥammad est Son serviteur et messager... il entrera au Paradis quelles que soient ses œuvres.", ref: "Rapporté par al-Bukhārī" }
    ]
  },
  {
    id: 2,
    arTitle: "باب من حقق التوحيد دخل الجنة بغير حساب",
    frTitle: "Celui qui réalise pleinement le Tawḥīd entre au Paradis sans jugement",
    arNum: "الباب الثاني",
    summary: `Ce chapitre traite des soixante-dix mille personnes qui entreront au Paradis sans jugement ni châtiment. Le Prophète ﷺ a décrit ces gens comme ceux qui ne pratiquent pas la ruqya (incantations), ne se font pas cautériser, ne croient pas aux mauvais augures, et placent leur entière confiance en leur Seigneur. L'auteur commente que la réalisation parfaite du Tawḥīd purifie le cœur de toute attache à autre qu'Allah, ce qui est la clé de l'entrée au Paradis sans compte.`,
    verses: [
      { ar: "إِنَّمَا الْمُؤْمِنُونَ الَّذِينَ إِذَا ذُكِرَ اللَّهُ وَجِلَتْ قُلُوبُهُمْ", fr: "Les vrais croyants sont ceux dont les cœurs frémissent quand on mentionne Allah.", ref: "Sourate al-Anfāl (8:2)" }
    ],
    hadiths: [
      { ar: "عَنِ ابْنِ عَبَّاسٍ رضي الله عنهما قَالَ: قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم: «عُرِضَتْ عَلَيَّ الْأُمَمُ فَرَأَيْتُ النَّبِيَّ وَمَعَهُ الرَّهْطُ وَالنَّبِيَّ وَمَعَهُ الرَّجُلُ وَالنَّبِيَّ وَمَعَهُ الرَّجُلَانِ وَالنَّبِيَّ لَيْسَ مَعَهُ أَحَدٌ، إِذْ رُفِعَ لِي سَوَادٌ عَظِيمٌ فَظَنَنْتُ أَنَّهُمْ أُمَّتِي، فَقِيلَ لِي: هَذَا مُوسَى وَقَوْمُهُ...»", fr: "Il m'a été montré les nations... puis on m'a montré une grande foule, j'ai pensé que c'était ma nation, mais on m'a dit : voici Mūsā et son peuple... Puis on m'a montré ma nation, et parmi eux soixante-dix mille qui entreront au Paradis sans jugement ni châtiment.", ref: "Rapporté par al-Bukhārī (6547) et Muslim (375)" }
    ]
  },
  {
    id: 3,
    arTitle: "باب الخوف من الشرك",
    frTitle: "La crainte du Shirk (polythéisme)",
    arNum: "الباب الثالث",
    summary: `L'auteur explique que le croyant doit constamment craindre de tomber dans le shirk, même mineur. Le Prophète ﷺ a dit : « Ce que je crains le plus pour vous, c'est le shirk mineur : ar-Riyā' (l'ostentation). » Le shirk est le plus grand des péchés, et Allah ne pardonne pas qu'on Lui associe quoi que ce soit. La crainte du shirk doit accompagner le croyant tout au long de sa vie, car il suffit d'un instant d'égarement pour anéantir des années d'obéissance.`,
    verses: [
      { ar: "إِنَّ اللَّهَ لَا يَغْفِرُ أَنْ يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذَٰلِكَ لِمَنْ يَشَاءُ", fr: "Certes, Allah ne pardonne pas qu'on Lui associe (quoi que ce soit) ; et Il pardonne ce qui est moins que cela à qui Il veut.", ref: "Sourate an-Nisāʾ (4:48)" },
      { ar: "وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا", fr: "Adorez Allah et ne Lui associez rien.", ref: "Sourate an-Nisāʾ (4:36)" }
    ],
    hadiths: [
      { ar: "عَنْ أَبِي هُرَيْرَةَ رضي الله عنه قَالَ: قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم: «إِنَّ أَخْوَفَ مَا أَخَافُ عَلَيْكُمُ الشِّرْكُ الْأَصْغَرُ» قَالُوا: وَمَا الشِّرْكُ الْأَصْغَرُ يَا رَسُولَ اللَّهِ؟ قَالَ: «الرِّيَاءُ»", fr: "Ce que je crains le plus pour vous, c'est le shirk mineur. Ils dirent : Qu'est-ce que le shirk mineur, ô Messager d'Allah ? Il dit : l'ostentation.", ref: "Rapporté par Aḥmad (5/428-429)" }
    ]
  },
  {
    id: 4,
    arTitle: "باب الدعاء إلى شهادة أن لا إله إلا الله",
    frTitle: "L'appel à la proclamation qu'il n'y a de divinité qu'Allah",
    arNum: "الباب الرابع",
    summary: `Ce chapitre explique l'importance de la da'wa (l'appel) à l'attestation de foi. Le Prophète ﷺ envoya des lettres aux rois et aux dirigeants de son temps, les appelant à dire : « Il n'y a de divinité qu'Allah. » Le message du Tawḥīd est universel et doit être transmis à tous. L'auteur souligne que l'appel à l'unicité d'Allah est la mission de tous les prophètes, depuis Nūḥ (Noé) jusqu'à Muḥammad ﷺ.`,
    verses: [
      { ar: "قُلْ هَٰذِهِ سَبِيلِي أَدْعُو إِلَى اللَّهِ عَلَىٰ بَصِيرَةٍ أَنَا وَمَنِ اتَّبَعَنِي", fr: "Dis : Voici ma voie, j'appelle à Allah en toute clairvoyance, moi et ceux qui me suivent.", ref: "Sourate Yūsuf (12:108)" },
      { ar: "وَلَقَدْ بَعَثْنَا فِي كُلِّ أُمَّةٍ رَسُولًا أَنِ اعْبُدُوا اللَّهَ وَاجْتَنِبُوا الطَّاغُوتَ", fr: "Nous avons envoyé dans chaque communauté un Messager [pour dire] : Adorez Allah et écartez-vous du Ṭāghūt.", ref: "Sourate an-Naḥl (16:36)" }
    ],
    hadiths: [
      { ar: "عَنِ ابْنِ عَبَّاسٍ رضي الله عنهما أَنَّ النَّبِيَّ صلى الله عليه وسلم بَعَثَ مُعَاذًا إِلَى الْيَمَنِ فَقَالَ: «إِنَّكَ تَأْتِي قَوْمًا أَهْلَ كِتَابٍ، فَلْيَكُنْ أَوَّلَ مَا تَدْعُوهُمْ إِلَيْهِ شَهَادَةُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ»", fr: "Tu vas vers un peuple du Livre. Que la première chose à laquelle tu les appelles soit l'attestation qu'il n'y a de divinité qu'Allah.", ref: "Rapporté par al-Bukhārī (1496) et Muslim (31)" }
    ]
  },
  {
    id: 5,
    arTitle: "باب تفسير التوحيد وشهادة أن لا إله إلا الله",
    frTitle: "L'explication du Tawḥīd et de l'attestation qu'il n'y a de divinité qu'Allah",
    arNum: "الباب الخامس",
    summary: `L'auteur explique en détail le sens de l'attestation « Lā ilāha illā Allāh » : elle comporte une négation (il n'y a de divinité) et une affirmation (qu'Allah). Elle exige du croyant de rejeter toute fausse divinité et d'adorer Allah seul. L'attestation n'est pas une simple formule prononcée par la langue, mais un engagement du cœur, confirmé par la langue et concrétisé par les actes. Le sens profond est que personne ne mérite l'adoration si ce n'est Allah.`,
    verses: [
      { ar: "فَاعْلَمْ أَنَّهُ لَا إِلَهَ إِلَّا اللَّهُ", fr: "Sache donc qu'il n'y a point de divinité [digne d'adoration] à part Allah.", ref: "Sourate Muḥammad (47:19)" },
      { ar: "لَا إِكْرَاهَ فِي الدِّينِ ۖ قَدْ تَبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ ۚ فَمَنْ يَكْفُرْ بِالطَّاغُوتِ وَيُؤْمِنْ بِاللَّهِ فَقَدِ اسْتَمْسَكَ بِالْعُرْوَةِ الْوُثْقَىٰ", fr: "Nulle contrainte en religion ! Car le bon chemin s'est distingué de l'égarement. Donc, quiconque mécroit au Ṭāghūt et croit en Allah, saisit l'anse la plus solide.", ref: "Sourate al-Baqarah (2:256)" }
    ],
    hadiths: [
      { ar: "عَنْ عُثْمَانَ بْنِ عَفَّانَ رضي الله عنه قَالَ: قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم: «مَنْ مَاتَ وَهُوَ يَعْلَمُ أَنَّهُ لَا إِلَهَ إِلَّا اللَّهُ دَخَلَ الْجَنَّةَ»", fr: "Quiconque meurt en sachant qu'il n'y a de divinité qu'Allah entrera au Paradis.", ref: "Rapporté par Muslim (53)" }
    ]
  },
  {
    id: 6,
    arTitle: "باب من الشرك لبس الحلقة والخيط ونحوهما لدفع البلاء",
    frTitle: "Du shirk : le port d'anneaux, de fils et autres pour repousser le malheur",
    arNum: "الباب السادس",
    summary: `Ce chapitre traite du port d'objets tels que des anneaux, des fils, des amulettes ou des talismans dans le but de repousser le malheur ou d'attirer la bénédiction. L'auteur explique que cela constitue du shirk car le croyant place sa confiance dans ces objets plutôt qu'en Allah Seul. Le Prophète ﷺ a dit : « Quiconque porte une amulette, qu'Allah ne réalise pas son souhait ; et quiconque porte un coquillage (contre le mauvais œil), qu'Allah ne le préserve pas. »`,
    verses: [
      { ar: "وَإِنْ يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ ۖ وَإِنْ يُرِدْكَ بِخَيْرٍ فَلَا رَادَّ لِفَضْلِهِ", fr: "Si Allah te touche d'un mal, nul ne peut l'écarter en dehors de Lui ; et s'Il te veut un bien, nul ne peut repousser Sa faveur.", ref: "Sourate Yūnus (10:107)" }
    ],
    hadiths: [
      { ar: "عَنْ عِمْرَانَ بْنِ حُصَيْنٍ رضي الله عنه أَنَّ النَّبِيَّ صلى الله عليه وسلم رَأَى رَجُلًا فِي يَدِهِ حَلْقَةٌ مِنْ صُفْرٍ فَقَالَ: «مَا هَذِهِ؟» قَالَ: مِنَ الْوَاهِنَةِ. فَقَالَ: «انْزِعْهَا فَإِنَّهَا لَا تَزِيدُكَ إِلَّا وَهْنًا»", fr: "Le Prophète ﷺ vit un homme portant un anneau de cuivre et lui dit : « Qu'est-ce que ceci ? » L'homme répondit : « C'est pour la faiblesse (al-Wāhina). » Le Prophète dit : « Enlève-le, car cela ne fait qu'augmenter ta faiblesse. »", ref: "Rapporté par Aḥmad (4/445)" }
    ]
  },
  {
    id: 7,
    arTitle: "باب في الرقى والتمائم",
    frTitle: "Les incantations (ruqā) et les amulettes (tamāʾim)",
    arNum: "الباب السابع",
    summary: `L'auteur distingue entre la ruqya légale (incantations tirées du Coran et de la Sunna) et les incantations interdites (qui impliquent des invocations à d'autres qu'Allah ou des formules incompréhensibles relevant de la sorcellerie). Les tamāʾim (amulettes) portées pour se protéger sont interdites car elles relèvent de l'association. Seule la protection d'Allah est efficace. Le grand commentateur souligne que les Compagnons considéraient toute amulette comme du shirk.`,
    verses: [
      { ar: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ", fr: "Nous faisons descendre du Coran ce qui est une guérison et une miséricorde pour les croyants.", ref: "Sourate al-Isrāʾ (17:82)" }
    ],
    hadiths: [
      { ar: "عَنْ أَبِي بَشِيرٍ الْأَنْصَارِيِّ رضي الله عنه أَنَّهُ كَانَ مَعَ النَّبِيِّ صلى الله عليه وسلم فِي بَعْضِ أَسْفَارِهِ، فَبَعَثَ رَسُولًا: «أَنْ لَا يَبْقَيَنَّ فِي رَقَبَةِ بَعِيرٍ قِلَادَةٌ مِنْ وَتَرٍ أَوْ قِلَادَةٌ إِلَّا قُطِعَتْ»", fr: "Le Prophète ﷺ envoya un messager : Qu'il ne reste aucun collier de corde d'arc au cou d'un chameau sans qu'il soit coupé.", ref: "Rapporté par al-Bukhārī (3105) et Muslim (4291)" }
    ]
  },
  {
    id: 8,
    arTitle: "باب من تبرك بشجر أو حجر أو نحو ذلك",
    frTitle: "Celui qui recherche la bénédiction (tabarruk) d'un arbre, d'une pierre ou autre",
    arNum: "الباب الثامن",
    summary: `L'auteur explique que la recherche de bénédiction (tabarruk) à travers des arbres, des pierres ou tout autre élément de la création est une forme de shirk. Cela rappelle la pratique des polythéistes avant l'Islam qui se rattachaient à des arbres et des pierres sacrés. Le seul tabarruk légitime est celui qui est conforme à la Sunna, comme la recherche de bénédiction à travers l'eau de Zamzam ou les traces du Prophète ﷺ de son vivant.`,
    hadiths: [
      { ar: "عَنْ أَبِي وَاقِدٍ اللَّيْثِيِّ رضي الله عنه قَالَ: خَرَجْنَا مَعَ النَّبِيِّ صلى الله عليه وسلم إِلَى حُنَيْنٍ وَنَحْنُ حُدَثَاءُ عَهْدٍ بِكُفْرٍ، وَلِلْمُشْرِكِينَ سِدْرَةٌ يَعْكُفُونَ عِنْدَهَا وَيُنَوِّطُونَ بِهَا أَسْلِحَتَهُمْ يُقَالُ لَهَا ذَاتُ أَنْوَاطٍ، فَمَرَرْنَا بِسِدْرَةٍ فَقُلْنَا: يَا رَسُولَ اللَّهِ، اجْعَلْ لَنَا ذَاتَ أَنْوَاطٍ كَمَا لَهُمْ ذَاتُ أَنْوَاطٍ. فَقَالَ النَّبِيُّ صلى الله عليه وسلم: «اللَّهُ أَكْبَرُ! إِنَّهَا السُّنَنُ، قُلْتُمْ وَالَّذِي نَفْسِي بِيَدِهِ كَمَا قَالَتْ بَنُو إِسْرَائِيلَ لِمُوسَى: اجْعَلْ لَنَا إِلَهًا كَمَا لَهُمْ آلِهَةٌ...»", fr: "Nous passâmes près d'un arbre et dîmes : Ô Messager d'Allah, fais de nous un arbre comme ils ont leur arbre ! Il répondit : Allah est Plus Grand ! Ce sont les traditions... Ce que vous dites est semblable à ce que les fils d'Israël dirent à Moïse : Fais-nous une divinité comme ils ont des divinités.", ref: "Rapporté par al-Tirmidhī (2180)" }
    ]
  },
  {
    id: 9,
    arTitle: "باب ما جاء في الذبح لغير الله",
    frTitle: "Ce qui est rapporté concernant le sacrifice pour autre qu'Allah",
    arNum: "الباب التاسع",
    summary: `Le sacrifice pour autre qu'Allah est un acte majeur de shirk. L'auteur commente que celui qui immole une bête en invoquant un nom autre que celui d'Allah commet un péché gravissime. Le sacrifice est un acte d'adoration qui n'est dû qu'à Allah Seul. Le Prophète ﷺ a maudit celui qui sacrifie pour autre qu'Allah.`,
    verses: [
      { ar: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", fr: "Accomplis la Ṣalāt pour ton Seigneur et sacrifie.", ref: "Sourate al-Kawthar (108:2)" },
      { ar: "قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ، لَا شَرِيكَ لَهُ", fr: "Dis : En vérité, ma prière, mes actes de dévotion, ma vie et ma mort appartiennent à Allah, Seigneur de l'univers. À Lui nul associé.", ref: "Sourate al-Anʿām (6:162-163)" }
    ],
    hadiths: [
      { ar: "عَنْ عَلِيِّ بْنِ أَبِي طَالِبٍ رضي الله عنه قَالَ: حَدَّثَنِي رَسُولُ اللَّهِ صلى الله عليه وسلم: «لَعَنَ اللَّهُ مَنْ ذَبَحَ لِغَيْرِ اللَّهِ»", fr: "Qu'Allah maudisse celui qui sacrifie pour autre qu'Allah.", ref: "Rapporté par Muslim (4298)" }
    ]
  },
  {
    id: 10,
    arTitle: "باب لا يذبح لله بمكان يذبح فيه لغير الله",
    frTitle: "On ne doit pas sacrifier pour Allah dans un lieu où l'on sacrifie pour autre qu'Allah",
    arNum: "الباب العاشر",
    summary: `Ce chapitre interdit de sacrifier pour Allah dans un endroit où des sacrifices sont également offerts à d'autres qu'Allah. Cela fait partie des moyens (sadd al-dharāʾiʿ) de protéger le Tawḥīd, car agir ainsi pourrait prêter à confusion et être une porte vers le shirk. Le Prophète ﷺ a interdit cela pour préserver la pureté du culte.`,
    hadiths: [
      { ar: "عَنْ ثَابِتِ بْنِ الضَّحَّاكِ رضي الله عنه قَالَ: نَذَرَ رَجُلٌ عَلَى عَهْدِ رَسُولِ اللَّهِ صلى الله عليه وسلم أَنْ يَنْحَرَ نَاقَةً بِبُوَانَةَ، فَأَتَى النَّبِيَّ صلى الله عليه وسلم فَقَالَ: إِنِّي نَذَرْتُ أَنْ أَنْحَرَ نَاقَةً بِبُوَانَةَ. فَقَالَ النَّبِيُّ صلى الله عليه وسلم: «هَلْ كَانَ فِيهَا وَثَنٌ مِنْ أَوْثَانِ الْجَاهِلِيَّةِ يُعْبَدُ؟» قَالُوا: لَا. قَالَ: «فَهَلْ كَانَ فِيهَا عِيدٌ مِنْ أَعْيَادِهِمْ؟» قَالُوا: لَا. قَالَ: «أَوْفِ بِنَذْرِكَ فَإِنَّهُ لَا وَفَاءَ لِنَذْرٍ فِي مَعْصِيَةِ اللَّهِ...»", fr: "Un homme fit le vœu d'égorger une chamelle à Buwāna. Il vint voir le Prophète ﷺ qui lui demanda : Y avait-il là une idole de la jāhiliyya adorée ? Ils répondirent : Non. Il demanda : Y avait-il là une de leurs fêtes ? Non. Alors accomplis ton vœu.", ref: "Rapporté par Abū Dāwūd (3313)" }
    ]
  },
  {
    id: 11,
    arTitle: "باب من الشرك النذر لغير الله",
    frTitle: "Du shirk : le vœu (nadhr) à autre qu'Allah",
    arNum: "الباب الحادي عشر",
    summary: `Faire un vœu à autre qu'Allah est une forme de shirk, car le vœu est un acte d'adoration. Le Prophète ﷺ a dit : « Celui qui fait un vœu d'obéir à Allah, qu'il Lui obéisse ; et celui qui fait un vœu de Lui désobéir, qu'il ne Lui désobéisse pas. » L'auteur précise que le vœu à une créature, qu'il s'agisse d'un saint, d'un jinn ou de toute autre créature, est du shirk majeur.`,
    hadiths: [
      { ar: "عَنْ عَائِشَةَ رضي الله عنها قَالَتْ: قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم: «مَنْ نَذَرَ أَنْ يُطِيعَ اللَّهَ فَلْيُطِعْهُ، وَمَنْ نَذَرَ أَنْ يَعْصِيَهُ فَلَا يَعْصِهِ»", fr: "Celui qui fait le vœu d'obéir à Allah, qu'il Lui obéisse ; et celui qui fait le vœu de Lui désobéir, qu'Il ne Lui désobéisse pas.", ref: "Rapporté par al-Bukhārī (6696)" }
    ]
  }
];

// Placeholder for remaining chapters (12-66) - will expand
for (let i = 12; i <= 66; i++) {
  if (!CHAPTERS.find(c => c.id === i)) {
    CHAPTERS.push({
      id: i,
      arTitle: "",
      frTitle: "",
      arNum: `الباب ${i}`,
      summary: "Contenu à venir...",
      verses: [],
      hadiths: []
    });
  }
}
