/* ISC Chemistry (862) — Class XI & XII */
window.SM = window.SM || {subjects:{}};
window.SM.subjects.chemistry = {
  id:'chemistry', name:'Chemistry', code:'862', icon:'🧪', colour:'#e0803a',
  pattern:'Paper I Theory 70 marks (3 hrs) — Physical 25 · Inorganic 14 · Organic 31 · Paper II Practical 15 + Project 10 + File 5 = 30',
  classes:{
  12:{ groups:[{marks:25, label:'Physical Chemistry', units:[1,2,3]},{marks:14, label:'Inorganic Chemistry', units:[4,5]},{marks:31, label:'Organic Chemistry', units:[6,7,8,9,10]}],
  chapters:[
  { id:'c12-1', unit:1, name:'Solutions', marks:'part of Physical (25)',
    topics:['Types of solutions; expressing concentration — molarity, molality, mole fraction, ppm, normality','Solubility of gases in liquids; Henry\'s law','Vapour pressure of liquid solutions; Raoult\'s law','Ideal and non-ideal solutions; positive and negative deviations; azeotropes','Colligative properties: relative lowering of vapour pressure, elevation of boiling point, depression of freezing point, osmotic pressure','Determination of molecular mass; abnormal molecular mass; van\'t Hoff factor'],
    concepts:[
      {t:'Colligative property', d:'A property that depends only on the number of solute particles present, not on their nature. The four are: relative lowering of vapour pressure, elevation of b.p., depression of f.p. and osmotic pressure.'},
      {t:'Raoult\'s law', d:'For a solution of two volatile liquids, the partial vapour pressure of each component is proportional to its mole fraction: p_A = p°_A x_A. For a non-volatile solute, the relative lowering of vapour pressure equals the mole fraction of the solute.'},
      {t:'Positive deviation', d:'A–B interactions are weaker than A–A and B–B, so vapour pressure is higher than predicted, ΔH_mix > 0, ΔV_mix > 0. Example: ethanol + acetone. Forms a minimum boiling azeotrope.'},
      {t:'Negative deviation', d:'A–B interactions are stronger (often H-bonding), vapour pressure lower than predicted, ΔH_mix < 0. Example: chloroform + acetone. Forms a maximum boiling azeotrope.'},
      {t:'van\'t Hoff factor', d:'i = observed colligative property / calculated value = number of particles after association or dissociation / before. i > 1 for dissociation (NaCl → 2), i < 1 for association (benzoic acid in benzene → 0.5).'},
      {t:'Osmotic pressure', d:'The excess pressure that must be applied to the solution to just stop osmosis. It is the preferred method for macromolecules because it is measurable at room temperature and gives large values.'}
    ],
    formulas:[
      {f:'Molarity M = moles solute / litre solution ; Molality m = moles solute / kg solvent', m:'Concentration (molality is temperature-independent)'},
      {f:'p = K_H · x', m:'Henry\'s law; K_H increases with temperature so gases are less soluble when hot'},
      {f:'p_total = p°_A x_A + p°_B x_B', m:'Raoult\'s law for two volatile liquids'},
      {f:'(p° − p)/p° = x_solute = n/(n+N)', m:'Relative lowering of vapour pressure'},
      {f:'ΔT_b = K_b·m ; ΔT_f = K_f·m', m:'Elevation of b.p. and depression of f.p.'},
      {f:'M₂ = (1000·K_b·w₂)/(ΔT_b·w₁)', m:'Molecular mass from elevation of boiling point'},
      {f:'π = CRT = (n/V)RT ; π = (w₂RT)/(M₂V)', m:'Osmotic pressure (van\'t Hoff equation)'},
      {f:'i = M_normal/M_observed ; α = (i−1)/(n−1) ; α = (1−i)/(1 − 1/n)', m:'van\'t Hoff factor; degree of dissociation / association'}
    ],
    mistakes:['Using molarity instead of molality in ΔT_b and ΔT_f — they need molality.','Forgetting the van\'t Hoff factor for electrolytes.','Confusing which mixture shows positive and which negative deviation.','Not converting the mass of solvent into kg for molality.'],
    questions:[
      {marks:2, q:'Define colligative properties. Why is molality preferred over molarity in their study?', a:'Colligative properties depend only on the number of solute particles and not on their nature. Molality is preferred because it is defined per kilogram of solvent (a mass), so it does not change with temperature, whereas molarity involves volume, which expands or contracts with temperature.'},
      {marks:3, q:'State Raoult\'s law and derive the expression for relative lowering of vapour pressure.', a:'Raoult\'s law: the partial vapour pressure of each volatile component is directly proportional to its mole fraction. For a non-volatile solute, p = p°x_A. Then p° − p = p°(1 − x_A) = p°x_B. So (p° − p)/p° = x_B = n/(n + N). For a dilute solution n ≪ N, so (p° − p)/p° ≈ n/N = (w₂/M₂)(M₁/w₁), which is used to find the molecular mass of the solute.'},
      {marks:3, q:'Explain positive and negative deviations from Raoult\'s law with one example each.', a:'Positive deviation: A–B interactions are weaker than A–A and B–B, so molecules escape more easily and observed vapour pressure exceeds the calculated value. ΔH_mix and ΔV_mix are positive. Example: ethanol and acetone — acetone breaks the H-bonding of ethanol. Such mixtures form minimum boiling azeotropes. Negative deviation: A–B interactions are stronger (often new H-bonds), so vapour pressure is lower than calculated, ΔH_mix and ΔV_mix are negative. Example: chloroform and acetone. These form maximum boiling azeotropes.'},
      {marks:2, q:'Why is osmotic pressure preferred over other colligative properties for determining the molecular mass of a polymer?', a:'Polymers have very high molecular mass, so their solutions are extremely dilute and the elevation of boiling point or depression of freezing point is too small to measure accurately. Osmotic pressure has a large measurable magnitude even in dilute solutions and is measured at room temperature, so the polymer is not decomposed by heating.'},
      {marks:3, q:'What is meant by abnormal molecular mass? Explain with the van\'t Hoff factor.', a:'When the observed molecular mass from a colligative property differs from the theoretical value, it is called abnormal. It arises when the solute dissociates (electrolytes) or associates (carboxylic acids in benzene) in solution. The van\'t Hoff factor i = observed colligative property/calculated value. For NaCl in water i ≈ 2 (dissociation, so observed molecular mass is halved); for benzoic acid in benzene i ≈ 0.5 (dimerisation, so observed molecular mass is doubled).'}
    ]},
  { id:'c12-2', unit:2, name:'Electrochemistry', marks:'part of Physical (25)',
    topics:['Redox reactions; electrolytic and galvanic cells','Electrode potential; standard hydrogen electrode; electrochemical series','emf of a cell; Nernst equation','Relation between Gibbs energy, emf and equilibrium constant','Conductance in electrolytic solutions; specific, molar and equivalent conductivity; variation with concentration','Kohlrausch\'s law and its applications','Electrolysis; Faraday\'s laws of electrolysis','Dry cell, lead storage battery, fuel cells; corrosion'],
    concepts:[
      {t:'Galvanic vs electrolytic cell', d:'Galvanic: chemical energy → electrical, spontaneous, anode is negative. Electrolytic: electrical → chemical, non-spontaneous, anode is positive. In both, oxidation is at the anode.'},
      {t:'Standard hydrogen electrode', d:'Reference electrode with E° arbitrarily set to 0.00 V: Pt|H₂(1 bar)|H⁺(1 M) at 298 K.'},
      {t:'Electrochemical series', d:'Elements arranged by standard reduction potential. Higher (more positive) E° means a stronger oxidising agent and easier reduction. Used to predict cell emf, feasibility of a reaction, and displacement reactions.'},
      {t:'Molar conductivity', d:'Λ_m = κ/c. It increases on dilution because the number of ions per unit volume falls but the total volume containing one mole increases; for strong electrolytes the rise is small (Debye–Hückel–Onsager), for weak electrolytes it is very steep near infinite dilution.'},
      {t:'Kohlrausch\'s law', d:'At infinite dilution the molar conductivity of an electrolyte is the sum of the individual contributions of its ions. Used to find Λ°_m of weak electrolytes and hence their degree of dissociation and K_a.'},
      {t:'Corrosion', d:'An electrochemical process: iron acts as anode (Fe → Fe²⁺ + 2e⁻), oxygen in the presence of H⁺ acts as cathode. Prevented by barrier protection, galvanising and cathodic (sacrificial) protection with Zn or Mg.'}
    ],
    formulas:[
      {f:'E°_cell = E°_cathode − E°_anode', m:'Standard cell potential'},
      {f:'E_cell = E°_cell − (0.0591/n)·log Q  (at 298 K)', m:'Nernst equation'},
      {f:'ΔG° = −nFE°_cell ; ΔG° = −2.303RT log K', m:'Gibbs energy and emf'},
      {f:'log K_c = (n·E°_cell)/0.0591', m:'Equilibrium constant from emf'},
      {f:'κ = (1/R)(l/A) ; Λ_m = κ×1000/c', m:'Conductivity and molar conductivity'},
      {f:'Λ°_m = ν₊λ°₊ + ν₋λ°₋', m:'Kohlrausch\'s law'},
      {f:'α = Λ_m/Λ°_m ; K_a = cα²/(1−α)', m:'Degree of dissociation for a weak electrolyte'},
      {f:'w = Zit = (M/nF)·it ; F = 96500 C mol⁻¹', m:'Faraday\'s first law'},
      {f:'w₁/w₂ = E₁/E₂', m:'Faraday\'s second law'}
    ],
    mistakes:['Reversing cathode and anode in E°_cell = E°_cathode − E°_anode.','Using n incorrectly in the Nernst equation — n is the number of electrons in the balanced cell reaction.','Confusing κ (conductivity) with Λ_m (molar conductivity): κ decreases on dilution while Λ_m increases.','Forgetting to convert concentration to mol m⁻³ or use the 1000 factor.'],
    questions:[
      {marks:3, q:'Write the Nernst equation for the cell Zn|Zn²⁺(aq)||Cu²⁺(aq)|Cu and state how the emf changes when [Cu²⁺] is increased.', a:'Cell reaction: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), n = 2. E_cell = E°_cell − (0.0591/2)·log([Zn²⁺]/[Cu²⁺]). Increasing [Cu²⁺] makes the log term more negative, so E_cell increases. Conversely, increasing [Zn²⁺] decreases the emf.'},
      {marks:3, q:'State Kohlrausch\'s law and give two applications.', a:'At infinite dilution each ion contributes a definite amount to the total molar conductivity, independent of the other ion present: Λ°_m = ν₊λ°₊ + ν₋λ°₋. Applications: (i) calculating Λ°_m of a weak electrolyte such as acetic acid, which cannot be found by extrapolation — Λ°(CH₃COOH) = Λ°(CH₃COONa) + Λ°(HCl) − Λ°(NaCl); (ii) determining the degree of dissociation α = Λ_m/Λ°_m and hence the dissociation constant K_a = cα²/(1 − α).'},
      {marks:2, q:'Why does molar conductivity increase on dilution while conductivity decreases?', a:'Conductivity κ is the conductance of a unit volume of solution. On dilution the number of ions per unit volume falls, so κ decreases. Molar conductivity is the conductance of all the ions from one mole of electrolyte; on dilution the electrolyte dissociates more (weak) or interionic attraction falls (strong), so the total ionic mobility increases and Λ_m rises.'},
      {marks:3, q:'State Faraday\'s laws of electrolysis. Calculate the mass of copper deposited when 2 A flows for 30 minutes through CuSO₄ solution. (Cu = 63.5)', a:'First law: the mass deposited is proportional to the quantity of electricity passed, w = Zit. Second law: when the same quantity of electricity passes through different electrolytes, the masses deposited are proportional to their equivalent masses. Here Q = it = 2 × 1800 = 3600 C. Cu²⁺ + 2e⁻ → Cu, so equivalent mass = 63.5/2 = 31.75. w = (31.75 × 3600)/96500 = 1.18 g.'},
      {marks:2, q:'Explain the electrochemical theory of rusting of iron.', a:'Rusting is an electrochemical process. At the anodic site iron is oxidised: Fe → Fe²⁺ + 2e⁻. At the cathodic site, in the presence of moisture and dissolved oxygen, O₂ + 4H⁺ + 4e⁻ → 2H₂O. The Fe²⁺ ions are further oxidised by atmospheric oxygen to hydrated ferric oxide, Fe₂O₃·xH₂O, which is rust. Rusting is faster in acidic or salty water because the electrolyte conductivity is higher.'}
    ]},
  { id:'c12-3', unit:3, name:'Chemical Kinetics', marks:'part of Physical (25)',
    topics:['Rate of a reaction: average and instantaneous rate','Factors affecting rate: concentration, temperature, catalyst','Order and molecularity of a reaction','Rate law and specific rate constant','Integrated rate equations and half life for zero and first order reactions','Concept of collision theory','Activation energy; Arrhenius equation'],
    concepts:[
      {t:'Order vs molecularity', d:'Order is experimental — the sum of the powers of concentration terms in the rate law; it may be zero or fractional. Molecularity is theoretical — the number of species colliding in an elementary step; always a whole number ≥ 1 and never zero.'},
      {t:'Pseudo first order', d:'A reaction that is really second order but appears first order because one reactant is in large excess so its concentration is effectively constant. Example: acid hydrolysis of ethyl acetate or of cane sugar.'},
      {t:'Collision theory', d:'A reaction occurs only when molecules collide with energy equal to or greater than the activation energy AND with the correct orientation. Rate = P·Z·e^(−Ea/RT).'},
      {t:'Effect of catalyst', d:'A catalyst provides an alternative path of lower activation energy. It does not change ΔH or the position of equilibrium — it speeds up both forward and reverse reactions equally.'}
    ],
    formulas:[
      {f:'Rate = −Δ[R]/Δt = +Δ[P]/Δt', m:'Rate of reaction'},
      {f:'Rate = k[A]^x[B]^y ; order = x + y', m:'Rate law'},
      {f:'Zero order: [R] = [R]₀ − kt ; t½ = [R]₀/2k', m:'Zero order (units of k: mol L⁻¹ s⁻¹)'},
      {f:'First order: k = (2.303/t)·log([R]₀/[R]) ; t½ = 0.693/k', m:'First order (units of k: s⁻¹); t½ is independent of initial concentration'},
      {f:'k = A e^{−Ea/RT}', m:'Arrhenius equation'},
      {f:'log(k₂/k₁) = (Ea/2.303R)(1/T₁ − 1/T₂)', m:'Two-temperature form'}
    ],
    mistakes:['Assuming order equals molecularity.','Using the first order half-life formula for a zero order reaction.','Forgetting that k has different units for different orders.','Thinking a catalyst changes the equilibrium constant.'],
    questions:[
      {marks:3, q:'Derive the integrated rate equation for a first order reaction and show that its half life is independent of initial concentration.', a:'For R → P, rate = −d[R]/dt = k[R]. Rearranging, −d[R]/[R] = k dt. Integrating from [R]₀ at t = 0 to [R] at t: ln([R]₀/[R]) = kt, i.e. k = (2.303/t)·log([R]₀/[R]). At t = t½, [R] = [R]₀/2, so k = (2.303/t½)·log 2 = 0.693/t½, giving t½ = 0.693/k. This contains no concentration term, so the half life of a first order reaction is independent of the initial concentration.'},
      {marks:2, q:'Distinguish between order and molecularity of a reaction.', a:'Order is an experimentally determined quantity — the sum of the powers of the concentration terms in the rate law. It can be zero, fractional or negative, and applies to overall reactions. Molecularity is the number of reacting species taking part in an elementary step; it is a theoretical concept, always a positive whole number, and is meaningful only for elementary reactions.'},
      {marks:3, q:'Explain the effect of temperature on reaction rate using the Arrhenius equation.', a:'k = A e^(−Ea/RT). A rise in T increases the fraction of molecules with energy ≥ Ea (the area under the Maxwell–Boltzmann curve beyond Ea rises steeply), so k increases exponentially. For most reactions the rate roughly doubles for a 10 K rise near room temperature. Plotting log k against 1/T gives a straight line of slope −Ea/2.303R, from which the activation energy can be found.'},
      {marks:2, q:'What is a pseudo first order reaction? Give an example.', a:'A reaction which is bimolecular but follows first order kinetics because one reactant is present in large excess and its concentration remains practically constant. Example: acid-catalysed hydrolysis of ethyl acetate, CH₃COOC₂H₅ + H₂O → CH₃COOH + C₂H₅OH. Water is in large excess, so rate = k\'[ester] and the reaction appears first order.'}
    ]},
  { id:'c12-4', unit:4, name:'d- and f-Block Elements', marks:'part of Inorganic (14)',
    topics:['General introduction; electronic configuration; occurrence and characteristics of transition metals','General trends: metallic character, ionisation enthalpy, oxidation states, ionic radii, colour, catalytic property, magnetic properties, interstitial compounds, alloy formation','Preparation and properties of KMnO₄ and K₂Cr₂O₇','Lanthanoids: electronic configuration, oxidation states, lanthanoid contraction and its consequences','Actinoids: electronic configuration and oxidation states'],
    concepts:[
      {t:'Transition element', d:'An element whose atom or its stable ion has a partially filled d subshell. Zn, Cd and Hg are d-block but not transition elements as they have d¹⁰ configuration in both atom and ions.'},
      {t:'Variable oxidation state', d:'Arises because the (n−1)d and ns orbitals are close in energy, so electrons from both can participate in bonding. Mn shows the widest range (+2 to +7).'},
      {t:'Coloured ions', d:'Due to d–d transitions: in a ligand field the d orbitals split, and the ion absorbs visible light to promote an electron, transmitting the complementary colour. Sc³⁺ (d⁰) and Zn²⁺ (d¹⁰) are colourless.'},
      {t:'Catalytic activity', d:'Transition metals show variable oxidation states and can form intermediate compounds, or provide a large surface area for adsorption. Examples: V₂O₅ in the Contact process, Fe in the Haber process, Ni in hydrogenation.'},
      {t:'Lanthanoid contraction', d:'The steady decrease in atomic and ionic radii across the lanthanoid series due to poor shielding by 4f electrons, so the increasing nuclear charge is felt more strongly. Consequences: Zr and Hf have nearly identical size and are difficult to separate; the second and third transition series have similar properties; basicity of hydroxides decreases across the series.'}
    ],
    formulas:[
      {f:'μ = √(n(n+2)) BM', m:'Spin-only magnetic moment; n = number of unpaired electrons'},
      {f:'2KMnO₄ → K₂MnO₄ + MnO₂ + O₂ (above 513 K)', m:'Thermal decomposition of potassium permanganate'},
      {f:'MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O (E° = +1.51 V)', m:'KMnO₄ in acidic medium'},
      {f:'Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O', m:'K₂Cr₂O₇ in acidic medium'},
      {f:'2CrO₄²⁻ + 2H⁺ ⇌ Cr₂O₇²⁻ + H₂O', m:'Chromate–dichromate interconversion'}
    ],
    mistakes:['Calling Zn, Cd and Hg transition elements.','Forgetting that the magnetic moment formula uses only unpaired electrons.','Writing KMnO₄ reactions without balancing H⁺ and electrons.','Attributing lanthanoid contraction to increasing shielding rather than poor shielding by f electrons.'],
    questions:[
      {marks:2, q:'Why are Zn, Cd and Hg not regarded as transition elements?', a:'A transition element must have a partially filled d subshell in its atom or in one of its stable oxidation states. Zn, Cd and Hg have a completely filled d¹⁰ configuration both as atoms and as their common M²⁺ ions, so they do not show the characteristic properties of transition elements (colour, variable oxidation state, paramagnetism, catalysis).'},
      {marks:3, q:'What is lanthanoid contraction? Give two consequences.', a:'It is the regular decrease in atomic and ionic radii of the lanthanoids from La to Lu. As the atomic number rises, electrons enter the inner 4f orbitals which shield the outer electrons very poorly, so the effective nuclear charge increases and the size contracts. Consequences: (i) Zr (160 pm) and Hf (159 pm) have almost identical radii, so their chemistry is very similar and they occur together and are hard to separate; (ii) the basic character of the hydroxides decreases from La(OH)₃ to Lu(OH)₃.'},
      {marks:3, q:'Write the preparation of potassium dichromate from chromite ore and two of its oxidising reactions in acidic medium.', a:'Chromite ore is fused with sodium carbonate in the presence of air: 4FeCr₂O₄ + 8Na₂CO₃ + 7O₂ → 8Na₂CrO₄ + 2Fe₂O₃ + 8CO₂. The yellow sodium chromate solution is acidified to give sodium dichromate: 2Na₂CrO₄ + 2H⁺ → Na₂Cr₂O₇ + 2Na⁺ + H₂O. Treatment with KCl gives the less soluble K₂Cr₂O₇, which crystallises out. Oxidising reactions in acid: (i) it oxidises iodide to iodine, Cr₂O₇²⁻ + 14H⁺ + 6I⁻ → 2Cr³⁺ + 3I₂ + 7H₂O; (ii) it oxidises ferrous to ferric, Cr₂O₇²⁻ + 14H⁺ + 6Fe²⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O.'},
      {marks:2, q:'Why do transition metals form coloured compounds?', a:'Their ions have partially filled d orbitals. In the presence of ligands these d orbitals split into two sets of slightly different energy. The ion absorbs a photon of visible light to promote an electron from the lower to the higher set (a d–d transition), and the transmitted light — the complementary colour — is what we see. Ions with d⁰ (Sc³⁺, Ti⁴⁺) or d¹⁰ (Zn²⁺, Cu⁺) configurations are colourless as no d–d transition is possible.'}
    ]},
  { id:'c12-5', unit:5, name:'Coordination Compounds', marks:'part of Inorganic (14)',
    topics:['Introduction; ligands; coordination number; denticity; chelate','Werner\'s theory; primary and secondary valency','IUPAC nomenclature of mononuclear coordination compounds','Isomerism: structural (ionisation, linkage, coordination, hydrate) and stereo (geometrical, optical)','Bonding: Valence Bond Theory, hybridisation, inner and outer orbital complexes, magnetic behaviour','Crystal Field Theory: splitting in octahedral and tetrahedral fields, colour, spectrochemical series','Importance of coordination compounds in qualitative analysis, extraction of metals and biological systems'],
    concepts:[
      {t:'Ligand', d:'An ion or molecule with at least one lone pair that donates it to the central metal atom. Monodentate (NH₃, Cl⁻), bidentate (en, ox²⁻), polydentate (EDTA⁴⁻, hexadentate), ambidentate (NO₂⁻/ONO⁻, SCN⁻/NCS⁻).'},
      {t:'Chelate effect', d:'Complexes with polydentate ligands forming rings are far more stable than those with an equivalent number of monodentate ligands, because ring formation is entropically favourable.'},
      {t:'Werner\'s theory', d:'A metal has two kinds of valency: primary (ionisable, satisfied by anions, shown by dotted lines) and secondary (non-ionisable, the coordination number, fixed in space giving the geometry).'},
      {t:'Inner vs outer orbital complex', d:'In VBT, if (n−1)d orbitals are used the complex is inner orbital (low spin, e.g. d²sp³ for [Co(NH₃)₆]³⁺); if nd orbitals are used it is outer orbital (high spin, e.g. sp³d² for [CoF₆]³⁻).'},
      {t:'Spectrochemical series', d:'Ligands arranged by field strength: I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < NO₂⁻ < CN⁻ < CO. Strong field ligands cause large Δ₀ and pairing (low spin).'}
    ],
    formulas:[
      {f:'μ = √(n(n+2)) BM', m:'Magnetic moment predicts number of unpaired electrons and hence hybridisation'},
      {f:'Octahedral: Δ₀ ; Tetrahedral: Δ_t = (4/9)Δ₀', m:'Crystal field splitting'},
      {f:'Low spin when Δ₀ > P ; High spin when Δ₀ < P', m:'P = pairing energy'},
      {f:'Geometrical isomerism: Ma₂b₂ (square planar), Ma₄b₂ and Ma₃b₃ (octahedral)', m:'Where cis/trans arises'}
    ],
    mistakes:['Naming the ligands in the wrong order — they go alphabetically, before the metal.','Forgetting the ate suffix for anionic complexes ([Fe(CN)₆]³⁻ = hexacyanidoferrate(III)).','Assuming tetrahedral complexes can be low spin — Δ_t is too small, they are always high spin.','Ignoring that tetrahedral complexes show no geometrical isomerism.'],
    questions:[
      {marks:2, q:'Write the IUPAC name of (i) [Co(NH₃)₅Cl]Cl₂ and (ii) K₃[Fe(CN)₆].', a:'(i) Pentaamminechloridocobalt(III) chloride. (ii) Potassium hexacyanidoferrate(III).'},
      {marks:3, q:'Using VBT, explain the geometry and magnetic behaviour of [Ni(CN)₄]²⁻ and [NiCl₄]²⁻.', a:'Ni²⁺ is 3d⁸. In [Ni(CN)₄]²⁻, CN⁻ is a strong field ligand, so the two unpaired 3d electrons pair up, freeing one 3d orbital. Hybridisation is dsp², giving a square planar, diamagnetic complex (μ = 0). In [NiCl₄]²⁻, Cl⁻ is a weak field ligand, so no pairing occurs. Hybridisation is sp³, giving a tetrahedral, paramagnetic complex with two unpaired electrons (μ = √8 = 2.83 BM).'},
      {marks:3, q:'Explain crystal field splitting in an octahedral complex and the origin of colour.', a:'Six ligands approach along the axes. The d_{x²−y²} and d_{z²} orbitals (e_g) point directly at the ligands and are repelled more, so their energy rises by +0.6Δ₀; the d_{xy}, d_{yz}, d_{zx} orbitals (t_2g) lie between the axes and are stabilised by −0.4Δ₀. When Δ₀ corresponds to the energy of visible light, an electron is promoted from t_2g to e_g by absorbing that wavelength, and the complementary colour is transmitted — this is why most transition metal complexes are coloured.'},
      {marks:3, q:'What types of isomerism are shown by [Co(NH₃)₅(NO₂)]Cl₂?', a:'It shows linkage isomerism, because NO₂⁻ is an ambidentate ligand which can bind through nitrogen (nitrito-N, yellow) or through oxygen (nitrito-O, red). It also shows ionisation isomerism with [Co(NH₃)₅Cl]Cl(NO₂), where the chloride and nitrite exchange positions between the coordination sphere and the ionisation sphere.'},
      {marks:2, q:'Give two important applications of coordination compounds.', a:'(i) In qualitative analysis — Ni²⁺ is detected as a rose-red complex with dimethylglyoxime, and Cu²⁺ gives the deep blue [Cu(NH₃)₄]²⁺. (ii) In biological systems — haemoglobin is an Fe(II) complex that carries oxygen, and chlorophyll is a Mg complex essential for photosynthesis. (Also: extraction of silver and gold by cyanide complexes, and EDTA for estimating water hardness.)'}
    ]},
  { id:'c12-6', unit:6, name:'Haloalkanes and Haloarenes', marks:'part of Organic (31)',
    topics:['Nomenclature and classification; nature of C–X bond','Methods of preparation of haloalkanes and haloarenes','Physical and chemical properties','Mechanism of substitution reactions: SN1 and SN2','Optical rotation; chirality; retention and inversion','Uses and environmental effects of dichloromethane, trichloromethane, iodoform, freons, DDT'],
    concepts:[
      {t:'SN2 mechanism', d:'A single-step bimolecular reaction; the nucleophile attacks from the side opposite to the leaving group, giving inversion of configuration (Walden inversion). Rate ∝ [substrate][nucleophile]. Favoured by primary halides and polar aprotic solvents. Reactivity: 1° > 2° > 3°.'},
      {t:'SN1 mechanism', d:'Two steps via a planar carbocation intermediate; the rate depends only on the substrate. The nucleophile attacks from either face, giving racemisation. Favoured by tertiary halides and polar protic solvents. Reactivity: 3° > 2° > 1°.'},
      {t:'Why haloarenes are less reactive', d:'(i) The C–Cl bond has partial double bond character due to resonance, so it is shorter and stronger. (ii) The carbon is sp² hybridised, more electronegative, and holds the electron pair more tightly. (iii) Instability of the phenyl cation. (iv) Repulsion between the nucleophile and the electron-rich ring.'},
      {t:'Chirality', d:'A carbon with four different groups is asymmetric; the molecule and its mirror image are non-superimposable (enantiomers). They rotate plane polarised light equally but oppositely. An equimolar mixture (racemic mixture) is optically inactive by external compensation.'}
    ],
    formulas:[
      {f:'R–OH + SOCl₂ → R–Cl + SO₂↑ + HCl↑', m:'Darzen\'s method — best, byproducts are gases'},
      {f:'R–X + AgNO₂ → R–NO₂ (nitroalkane) ; R–X + KNO₂ → R–ONO (alkyl nitrite)', m:'Ambident nucleophile'},
      {f:'R–X + KCN → R–CN ; R–X + AgCN → R–NC', m:'Ambident nucleophile (cyanide)'},
      {f:'2R–X + 2Na (dry ether) → R–R + 2NaX', m:'Wurtz reaction'},
      {f:'C₆H₅X + 2Na + XC₆H₅ (dry ether) → C₆H₅–C₆H₅', m:'Fittig reaction'},
      {f:'R–X + Mg (dry ether) → RMgX', m:'Grignard reagent'},
      {f:'CHCl₃ + air/light → COCl₂ (phosgene)', m:'Why chloroform is stored in dark bottles filled to the brim'}
    ],
    mistakes:['Reversing the reactivity orders of SN1 and SN2.','Forgetting that SN2 gives inversion and SN1 gives racemisation.','Using KCN and AgCN interchangeably — KCN gives the nitrile, AgCN gives the isocyanide.','Saying haloarenes undergo nucleophilic substitution easily.'],
    questions:[
      {marks:3, q:'Distinguish between SN1 and SN2 mechanisms.', a:'SN1: two steps, unimolecular rate-determining step (ionisation to a carbocation), rate = k[RX], gives racemisation, favoured by 3° halides, polar protic solvents and weak nucleophiles. SN2: one step, bimolecular, rate = k[RX][Nu⁻], proceeds through a five-coordinate transition state, gives complete inversion of configuration, favoured by 1° halides, polar aprotic solvents and strong nucleophiles.'},
      {marks:3, q:'Why is chlorobenzene less reactive than chloroethane towards nucleophilic substitution?', a:'In chlorobenzene the lone pair on chlorine is delocalised into the ring, giving the C–Cl bond partial double bond character; it is therefore shorter (169 pm vs 177 pm) and stronger, and harder to break. The carbon is sp² hybridised and more electronegative, holding the shared pair more tightly. Additionally the phenyl cation that would form is highly unstable, and the electron-rich ring repels the incoming nucleophile.'},
      {marks:2, q:'What is a racemic mixture? Why is it optically inactive?', a:'An equimolar mixture of the two enantiomers of a chiral compound. Each enantiomer rotates plane polarised light through the same angle but in opposite directions, so the rotations cancel exactly. This is called external compensation, and the mixture is denoted (±).'},
      {marks:2, q:'Why is chloroform stored in dark coloured bottles completely filled?', a:'In the presence of air and sunlight, chloroform is slowly oxidised to phosgene (COCl₂), a highly poisonous gas: 2CHCl₃ + O₂ → 2COCl₂ + 2HCl. Dark bottles exclude light and filling to the brim excludes air, so oxidation is prevented. A little ethanol is also added, which converts any phosgene formed into harmless diethyl carbonate.'},
      {marks:2, q:'Write the mechanism of the reaction of tert-butyl bromide with aqueous KOH.', a:'It follows SN1. Step 1 (slow, rate determining): (CH₃)₃C–Br → (CH₃)₃C⁺ + Br⁻, forming a stable 3° carbocation. Step 2 (fast): (CH₃)₃C⁺ + OH⁻ → (CH₃)₃C–OH. Since the carbocation is planar, attack from either face is equally likely, and if the carbon were chiral the product would be racemic.'}
    ]},
  { id:'c12-7', unit:7, name:'Alcohols, Phenols and Ethers', marks:'part of Organic (31)',
    topics:['Alcohols: nomenclature, classification, methods of preparation','Physical and chemical properties of primary alcohols; identification of 1°, 2°, 3° alcohols','Mechanism of dehydration; uses','Phenols: preparation, properties, acidic nature, electrophilic substitution','Ethers: nomenclature, preparation, physical and chemical properties'],
    concepts:[
      {t:'Why alcohols have high boiling points', d:'Intermolecular hydrogen bonding gives associated molecules; more energy is needed to separate them than for the corresponding alkanes or ethers of similar molecular mass.'},
      {t:'Acidity of phenol', d:'Phenol is more acidic than alcohols because the phenoxide ion is resonance stabilised with the negative charge delocalised into the ring. Electron-withdrawing groups (–NO₂) increase acidity; electron-releasing groups (–CH₃) decrease it.'},
      {t:'Lucas test', d:'ZnCl₂ + conc. HCl. Tertiary alcohols give turbidity immediately, secondary in about 5 minutes, primary only on heating. Based on the ease of carbocation formation.'},
      {t:'Kolbe\'s reaction', d:'Sodium phenoxide + CO₂ under pressure, then acidification → salicylic acid. Electrophilic substitution at the ortho position.'},
      {t:'Reimer–Tiemann reaction', d:'Phenol + CHCl₃ + aqueous NaOH → salicylaldehyde. The electrophile is dichlorocarbene (:CCl₂).'}
    ],
    formulas:[
      {f:'R–CH=CH₂ + H₂O/H⁺ → Markovnikov addition ; B₂H₆ then H₂O₂/OH⁻ → anti-Markovnikov', m:'Alcohols from alkenes'},
      {f:'RMgX + HCHO → 1° alcohol ; + RCHO → 2° ; + R₂CO → 3°', m:'Grignard synthesis of alcohols'},
      {f:'C₂H₅OH + conc. H₂SO₄ (443 K) → CH₂=CH₂ ; (413 K) → diethyl ether', m:'Dehydration'},
      {f:'C₆H₅OH + CO₂/NaOH, then H⁺ → salicylic acid', m:'Kolbe\'s reaction'},
      {f:'C₆H₅OH + CHCl₃ + NaOH → salicylaldehyde', m:'Reimer–Tiemann'},
      {f:'R–ONa + R\'–X → R–O–R\'', m:'Williamson synthesis (use 1° halide to avoid elimination)'},
      {f:'Cumene + O₂, then H⁺ → phenol + acetone', m:'Industrial preparation of phenol'}
    ],
    mistakes:['Using a tertiary halide in Williamson synthesis — elimination dominates.','Saying phenol is more acidic than carboxylic acid (it is less).','Confusing the temperature for ether (413 K) and alkene (443 K) formation.','Forgetting that phenol gives electrophilic substitution readily at ortho and para positions because –OH is strongly activating.'],
    questions:[
      {marks:3, q:'Why is phenol more acidic than ethanol? How does the presence of a nitro group affect its acidity?', a:'In phenoxide, the negative charge on oxygen is delocalised into the benzene ring through resonance, giving a stabilised ion; in ethoxide no such delocalisation is possible and the alkyl group is electron releasing, intensifying the charge. Hence phenol loses H⁺ more readily (pKa ≈ 10 vs 16). A nitro group is strongly electron withdrawing (−I and −R) and further disperses the negative charge, so acidity increases sharply; 2,4,6-trinitrophenol (picric acid) is a strong acid.'},
      {marks:3, q:'Write the mechanism of acid-catalysed dehydration of ethanol to ethene.', a:'Step 1: protonation of the –OH group, C₂H₅OH + H⁺ → C₂H₅OH₂⁺. Step 2 (slow, rate determining): loss of water to form a carbocation, C₂H₅OH₂⁺ → CH₃CH₂⁺ + H₂O. Step 3: loss of a proton from the adjacent carbon to form the alkene, CH₃CH₂⁺ → CH₂=CH₂ + H⁺. Since a carbocation is formed, the ease of dehydration follows 3° > 2° > 1°.'},
      {marks:2, q:'How will you distinguish between ethanol and phenol chemically? Give two tests.', a:'(i) Neutral FeCl₃ test: phenol gives a violet colouration; ethanol gives no colour. (ii) Sodium hydroxide test: phenol dissolves in NaOH to form sodium phenoxide (it is acidic); ethanol does not react. (iii) Bromine water: phenol gives a white precipitate of 2,4,6-tribromophenol; ethanol gives none.'},
      {marks:2, q:'Explain Williamson\'s synthesis. Why is it unsuitable for preparing tert-butyl methyl ether from tert-butyl bromide and sodium methoxide?', a:'An alkyl halide is heated with sodium alkoxide to give an ether: R–ONa + R\'X → R–O–R\' + NaX. It proceeds by SN2, so the halide must be primary. With tert-butyl bromide the alkoxide acts as a strong base rather than a nucleophile and elimination occurs, giving isobutylene instead of the ether. The correct combination is sodium tert-butoxide with methyl bromide.'}
    ]},
  { id:'c12-8', unit:8, name:'Aldehydes, Ketones and Carboxylic Acids', marks:'part of Organic (31)',
    topics:['Nomenclature; nature of the carbonyl group','Methods of preparation of aldehydes and ketones','Physical and chemical properties; mechanism of nucleophilic addition','Reactivity of the alpha hydrogen in aldehydes; aldol and Cannizzaro reactions','Uses of aldehydes and ketones','Carboxylic acids: nomenclature, acidic strength and factors affecting it','Methods of preparation; physical and chemical properties; uses'],
    concepts:[
      {t:'Nucleophilic addition', d:'The carbonyl carbon is electrophilic because oxygen is more electronegative. A nucleophile attacks it, the π electrons shift to oxygen, and the alkoxide is then protonated. Aldehydes are more reactive than ketones due to less steric hindrance and less +I electron release.'},
      {t:'Aldol condensation', d:'Aldehydes/ketones with at least one α-hydrogen, in dilute alkali, give a β-hydroxy carbonyl compound which on heating loses water to form an α,β-unsaturated compound.'},
      {t:'Cannizzaro reaction', d:'Aldehydes with NO α-hydrogen (HCHO, C₆H₅CHO) undergo disproportionation with concentrated alkali — one molecule is oxidised to the acid salt and another reduced to the alcohol.'},
      {t:'Acidity of carboxylic acids', d:'The carboxylate ion is resonance stabilised with the charge shared equally by two oxygens, so carboxylic acids are far more acidic than phenols and alcohols. Electron-withdrawing groups (Cl) increase acidity; the effect falls with distance.'},
      {t:'Iodoform test', d:'Compounds with a CH₃CO– group (or CH₃CH(OH)– which is oxidised to it) give a yellow precipitate of CHI₃ with I₂/NaOH. Ethanal gives it; propanal does not.'}
    ],
    formulas:[
      {f:'RCOCl + H₂/Pd-BaSO₄ → RCHO', m:'Rosenmund reduction'},
      {f:'RCN + SnCl₂/HCl, then H₂O → RCHO', m:'Stephen reaction'},
      {f:'C₆H₆ + RCOCl/AlCl₃ → C₆H₅COR', m:'Friedel–Crafts acylation'},
      {f:'Toluene + CrO₂Cl₂ → benzaldehyde', m:'Etard reaction'},
      {f:'RCHO + NH₂OH → oxime ; + NH₂NH₂ → hydrazone ; + 2,4-DNP → 2,4-dinitrophenylhydrazone (orange ppt)', m:'Addition–elimination tests'},
      {f:'RCHO + Tollens\' reagent → silver mirror ; + Fehling\'s → red Cu₂O', m:'Distinguishing aldehyde from ketone'},
      {f:'2CH₃CHO + dil. NaOH → CH₃CH(OH)CH₂CHO → CH₃CH=CHCHO + H₂O', m:'Aldol condensation'},
      {f:'2HCHO + conc. NaOH → CH₃OH + HCOONa', m:'Cannizzaro reaction'},
      {f:'RCOOH + LiAlH₄ → RCH₂OH ; RCOOH + NaHCO₃ → CO₂↑', m:'Reduction; test for –COOH'},
      {f:'RCOOH + Cl₂/red P → α-chloro acid', m:'Hell–Volhard–Zelinsky reaction'}
    ],
    mistakes:['Applying aldol condensation to compounds with no α-hydrogen.','Saying aromatic aldehydes give a positive Fehling\'s test — they do not (they do give Tollens\').','Confusing the products of Cannizzaro (alcohol + salt of acid).','Forgetting that the NaHCO₃ test distinguishes carboxylic acid from phenol (phenol gives no CO₂).'],
    questions:[
      {marks:3, q:'Why are aldehydes more reactive than ketones towards nucleophilic addition?', a:'Two reasons. Electronic: a ketone has two alkyl groups with +I effect which reduce the positive charge on the carbonyl carbon, making it less electrophilic; an aldehyde has only one. Steric: the two bulky alkyl groups in a ketone hinder the approach of the nucleophile and crowd the tetrahedral transition state. Hence the order is HCHO > CH₃CHO > CH₃COCH₃.'},
      {marks:3, q:'Explain the Cannizzaro reaction with a mechanism outline, using benzaldehyde.', a:'Aldehydes with no α-hydrogen undergo self-oxidation–reduction with concentrated alkali. OH⁻ adds to the carbonyl carbon of one molecule giving an alkoxide intermediate; this transfers a hydride ion to the carbonyl carbon of a second molecule. The first molecule becomes benzoate (oxidised) and the second becomes benzyl alcohol (reduced): 2C₆H₅CHO + NaOH → C₆H₅CH₂OH + C₆H₅COONa.'},
      {marks:2, q:'How will you distinguish between ethanal and propanone? Give two tests.', a:'(i) Tollens\' reagent: ethanal, being an aldehyde, gives a bright silver mirror; propanone gives no reaction. (ii) Fehling\'s solution: ethanal gives a red precipitate of Cu₂O; propanone does not. (Note the iodoform test does not distinguish them — both contain a CH₃CO– group and both give iodoform.)'},
      {marks:3, q:'Arrange in increasing order of acidic strength with reason: CH₃COOH, ClCH₂COOH, Cl₂CHCOOH, C₆H₅OH.', a:'C₆H₅OH < CH₃COOH < ClCH₂COOH < Cl₂CHCOOH. Phenoxide is stabilised by resonance but the charge sits mainly on carbon atoms of the ring, whereas carboxylate has the charge shared equally between two electronegative oxygens — so carboxylic acids are stronger. Within the acids, chlorine exerts a −I effect that disperses the negative charge on the carboxylate; two chlorines disperse it more than one, so acidity rises with the number of chlorine atoms.'},
      {marks:2, q:'What is the aldol condensation? Why does benzaldehyde not undergo it?', a:'Aldehydes or ketones containing at least one α-hydrogen, treated with dilute alkali, give a β-hydroxy aldehyde or ketone (an aldol), which on heating loses water to give an α,β-unsaturated carbonyl compound. Benzaldehyde has no α-hydrogen (the carbon adjacent to the carbonyl is part of the aromatic ring), so no carbanion can form and no aldol condensation occurs — it undergoes the Cannizzaro reaction instead.'}
    ]},
  { id:'c12-9', unit:9, name:'Organic Compounds Containing Nitrogen', marks:'part of Organic (31)',
    topics:['Amines: nomenclature, classification, structure, methods of preparation','Physical and chemical properties; basic character; identification of 1°, 2°, 3° amines','Cyanides and isocyanides','Diazonium salts: preparation, chemical reactions and importance in synthetic organic chemistry'],
    concepts:[
      {t:'Basicity of amines', d:'In the gas phase basicity follows 3° > 2° > 1° > NH₃ (inductive effect only). In aqueous solution solvation and steric effects also matter, giving 2° > 1° > 3° > NH₃ for methyl amines. Aromatic amines are far weaker because the lone pair is delocalised into the ring.'},
      {t:'Hinsberg\'s test', d:'Benzenesulphonyl chloride: 1° amines give a product soluble in alkali (has an acidic N–H), 2° amines give a product insoluble in alkali, and 3° amines do not react.'},
      {t:'Carbylamine test', d:'Only primary amines (aliphatic or aromatic) with CHCl₃ and alcoholic KOH give an isocyanide with an extremely offensive smell.'},
      {t:'Diazonium salts', d:'Aryl diazonium salts, made at 273–278 K, are versatile intermediates because –N₂⁺ is an excellent leaving group replaceable by –Cl, –Br, –CN, –OH, –I, –F, –H, allowing substituents that cannot be introduced directly.'}
    ],
    formulas:[
      {f:'R–CN + 4[H] → RCH₂NH₂ (1° amine)', m:'Reduction of nitriles'},
      {f:'RCONH₂ + Br₂ + 4NaOH → RNH₂ + Na₂CO₃ + 2NaBr + 2H₂O', m:'Hoffmann bromamide degradation — gives an amine with one carbon less'},
      {f:'Phthalimide + KOH, then R–X, then hydrolysis → pure 1° amine', m:'Gabriel phthalimide synthesis (fails for aryl amines)'},
      {f:'C₆H₅NO₂ + 6[H] (Sn/HCl) → C₆H₅NH₂', m:'Aniline from nitrobenzene'},
      {f:'RNH₂ + CHCl₃ + 3KOH → RNC + 3KCl + 3H₂O', m:'Carbylamine reaction (test for 1° amine)'},
      {f:'C₆H₅NH₂ + NaNO₂/HCl (273–278 K) → C₆H₅N₂⁺Cl⁻', m:'Diazotisation'},
      {f:'C₆H₅N₂⁺Cl⁻ + CuCl/HCl → C₆H₅Cl', m:'Sandmeyer reaction (Cu₂Cl₂/CuBr/CuCN)'},
      {f:'C₆H₅N₂⁺Cl⁻ + C₆H₅OH → p-hydroxyazobenzene (orange dye)', m:'Coupling reaction'}
    ],
    mistakes:['Using the Gabriel synthesis for aromatic amines — it does not work.','Forgetting that Hoffmann bromamide gives an amine with one carbon LESS.','Not maintaining 273–278 K for diazotisation — the salt decomposes.','Assuming aniline is more basic than ammonia — it is much less basic.'],
    questions:[
      {marks:3, q:'Why is aniline a weaker base than ethylamine?', a:'In aniline the lone pair on nitrogen is delocalised into the benzene ring through resonance, so it is less available for donation to a proton. In addition, the sp² hybridised carbon of the ring exerts a −I effect. In ethylamine the ethyl group has a +I effect which increases electron density on nitrogen and the lone pair is fully available. Hence ethylamine (Kb ≈ 10⁻⁴) is far more basic than aniline (Kb ≈ 10⁻¹⁰).'},
      {marks:3, q:'Describe the Hoffmann bromamide degradation reaction with an example. What is special about the product?', a:'An amide is treated with bromine and aqueous or alcoholic KOH: RCONH₂ + Br₂ + 4KOH → RNH₂ + K₂CO₃ + 2KBr + 2H₂O. For example, acetamide gives methylamine. The product is a primary amine containing one carbon atom fewer than the starting amide, because the carbonyl carbon is lost as carbonate. The reaction proceeds via a nitrene/isocyanate intermediate with migration of the alkyl group.'},
      {marks:3, q:'How is benzene diazonium chloride prepared? Give two of its synthetic uses.', a:'Aniline is treated with nitrous acid (NaNO₂ + dilute HCl) at 273–278 K: C₆H₅NH₂ + HNO₂ + HCl → C₆H₅N₂⁺Cl⁻ + 2H₂O. The low temperature is essential as the salt decomposes above 278 K. Uses: (i) Sandmeyer reaction — treatment with Cu₂Cl₂/HCl or Cu₂Br₂/HBr gives chlorobenzene or bromobenzene, which cannot be made directly with the required purity; (ii) coupling with phenol in mildly alkaline medium gives p-hydroxyazobenzene, an orange azo dye.'},
      {marks:2, q:'How will you distinguish between primary, secondary and tertiary amines using Hinsberg\'s reagent?', a:'Benzenesulphonyl chloride reacts with a 1° amine to give N-alkylbenzenesulphonamide, which has an acidic hydrogen on nitrogen and therefore dissolves in KOH. With a 2° amine it gives N,N-dialkylbenzenesulphonamide with no N–H, so it is insoluble in alkali. A 3° amine has no hydrogen on nitrogen and does not react at all.'}
    ]},
  { id:'c12-10', unit:10, name:'Biomolecules', marks:'part of Organic (31)',
    topics:['Carbohydrates: classification (aldoses and ketoses), monosaccharides — glucose and fructose; structure and elementary idea of D and L configuration','Oligosaccharides (sucrose, lactose, maltose) and polysaccharides (starch, cellulose, glycogen)','Importance of carbohydrates','Proteins: elementary idea of α-amino acids, peptide bond, polypeptides','Structure of proteins: primary, secondary, tertiary and quaternary; denaturation','Enzymes','Vitamins: classification and functions','Nucleic acids: DNA and RNA'],
    concepts:[
      {t:'Reducing sugar', d:'A carbohydrate with a free aldehydic or ketonic group that reduces Tollens\' and Fehling\'s reagents. All monosaccharides, plus maltose and lactose, are reducing; sucrose is non-reducing because both anomeric carbons are involved in the glycosidic link.'},
      {t:'Mutarotation', d:'The gradual change in specific rotation of a freshly prepared solution of α- or β-glucose until it reaches an equilibrium value (+52.5°), because the two anomers interconvert through the open chain form.'},
      {t:'Peptide bond', d:'The –CO–NH– link formed by condensation between the carboxyl of one amino acid and the amino of another, with loss of water.'},
      {t:'Denaturation', d:'Loss of the secondary and tertiary structure of a protein by heat, pH change or heavy metals, while the primary structure remains intact. The protein loses biological activity. Example: coagulation of egg white on boiling.'},
      {t:'Zwitterion', d:'In aqueous solution an amino acid exists as a dipolar ion, ⁺H₃N–CHR–COO⁻. This explains their high melting points, solubility in water and behaviour as both acid and base (amphoteric).'}
    ],
    formulas:[
      {f:'Glucose + HI/Δ → n-hexane', m:'Proves a straight chain of six carbons'},
      {f:'Glucose + HCN → cyanohydrin ; + NH₂OH → oxime', m:'Proves a carbonyl group'},
      {f:'Glucose + Br₂ water → gluconic acid ; + HNO₃ → saccharic acid', m:'Proves an aldehyde group and a primary –OH'},
      {f:'Glucose + acetic anhydride → pentaacetate', m:'Proves five –OH groups'},
      {f:'Sucrose + H₂O/H⁺ → glucose + fructose (invert sugar)', m:'Inversion of cane sugar (+66.5° → −20°)'},
      {f:'Starch: amylose (α-1,4) + amylopectin ; Cellulose: β-1,4 glucose', m:'Polysaccharide linkages'}
    ],
    mistakes:['Calling sucrose a reducing sugar.','Confusing the linkages in starch (α) and cellulose (β) — this is why humans digest starch but not cellulose.','Saying denaturation destroys the primary structure.','Mixing up fat-soluble (A, D, E, K) and water-soluble (B group, C) vitamins.'],
    questions:[
      {marks:3, q:'Give reactions that establish the presence of (i) a straight chain of six carbons, (ii) an aldehyde group and (iii) five hydroxyl groups in glucose.', a:'(i) On prolonged heating with HI, glucose gives n-hexane, showing that all six carbon atoms are in a straight chain. (ii) It forms an oxime with hydroxylamine and a cyanohydrin with HCN, showing a carbonyl group; and it reduces Tollens\' and Fehling\'s reagents and gives gluconic acid with bromine water, showing that the carbonyl is an aldehyde. (iii) With acetic anhydride it gives glucose pentaacetate, showing five hydroxyl groups; their stability indicates each is on a different carbon.'},
      {marks:2, q:'What is mutarotation? Explain with reference to glucose.', a:'It is the spontaneous change in the specific rotation of an optically active sugar solution until a constant value is reached. Freshly prepared α-D-glucose has [α] = +111° and β-D-glucose +19.2°; either changes to +52.5° on standing. This happens because the cyclic anomers interconvert through the open chain aldehyde form, giving an equilibrium mixture of about 36% α and 64% β.'},
      {marks:3, q:'Describe the four levels of protein structure.', a:'Primary: the specific sequence of amino acids joined by peptide bonds — any change alters the protein completely. Secondary: the regular folding of the chain into an α-helix or β-pleated sheet, stabilised by hydrogen bonds between C=O and N–H groups. Tertiary: the overall three-dimensional folding of the whole chain (fibrous or globular), stabilised by hydrogen bonds, disulphide bridges, ionic and van der Waals forces. Quaternary: the spatial arrangement of two or more polypeptide subunits, as in haemoglobin which has four.'},
      {marks:2, q:'Distinguish between DNA and RNA in three respects.', a:'(i) Sugar: DNA has 2-deoxy-D-ribose; RNA has D-ribose. (ii) Bases: DNA has adenine, guanine, cytosine and thymine; RNA has uracil in place of thymine. (iii) Structure and function: DNA is a double helix and is the store of hereditary information, capable of self-replication; RNA is usually single stranded and carries out protein synthesis. (Also: DNA is found mainly in the nucleus, RNA mainly in the cytoplasm.)'},
      {marks:2, q:'Name the vitamins whose deficiency causes (i) rickets, (ii) scurvy, (iii) night blindness, (iv) beri-beri.', a:'(i) Vitamin D (calciferol), (ii) Vitamin C (ascorbic acid), (iii) Vitamin A (retinol), (iv) Vitamin B₁ (thiamine).'}
    ]}
  ]},
  11:{ groups:[], chapters:[
  { id:'c11-1', unit:1, name:'Some Basic Concepts of Chemistry', marks:'—',
    topics:['Matter and its nature; laws of chemical combination','Dalton\'s atomic theory; atomic and molecular masses','Mole concept and molar mass; Avogadro\'s number','Percentage composition; empirical and molecular formula','Stoichiometry and calculations based on it; limiting reagent','Concentration terms: molarity, molality, mole fraction'],
    concepts:[
      {t:'Mole', d:'The amount of substance containing as many elementary entities as there are atoms in exactly 12 g of C-12, i.e. 6.022×10²³ (Avogadro\'s number).'},
      {t:'Limiting reagent', d:'The reactant that is completely consumed first and hence determines the amount of product. Found by dividing moles of each reactant by its stoichiometric coefficient and taking the smallest.'},
      {t:'Empirical vs molecular formula', d:'Empirical formula gives the simplest whole number ratio of atoms; molecular formula = n × empirical formula, where n = molecular mass / empirical formula mass.'}
    ],
    formulas:[
      {f:'n = given mass/molar mass = number of particles/6.022×10²³ = volume at STP/22.4 L', m:'Mole relationships'},
      {f:'M₁V₁ = M₂V₂', m:'Dilution / titration'},
      {f:'Mole fraction x_A = n_A/(n_A + n_B)', m:'Composition'},
      {f:'% yield = (actual/theoretical) × 100', m:'Yield'}
    ],
    mistakes:['Using 22.4 L for a gas not at STP.','Forgetting to identify the limiting reagent in stoichiometry problems.','Confusing molarity (per litre of solution) with molality (per kg of solvent).'],
    questions:[
      {marks:3, q:'Calculate the empirical formula of a compound containing 40% C, 6.7% H and 53.3% O. If its molecular mass is 180, find the molecular formula.', a:'Divide each percentage by the atomic mass: C = 40/12 = 3.33, H = 6.7/1 = 6.7, O = 53.3/16 = 3.33. Dividing by the smallest (3.33): C = 1, H = 2, O = 1. Empirical formula = CH₂O, empirical formula mass = 30. n = 180/30 = 6. Molecular formula = C₆H₁₂O₆ (glucose).'}
    ]},
  { id:'c11-2', unit:2, name:'Structure of Atom', marks:'—',
    topics:['Discovery of electron, proton and neutron; atomic number, isotopes and isobars','Thomson\'s and Rutherford\'s models and their limitations','Bohr\'s model and its limitations','Dual nature of matter; de Broglie relation; Heisenberg uncertainty principle','Quantum mechanical model; concept of orbitals; quantum numbers','Shapes of s, p and d orbitals; Aufbau principle, Pauli exclusion principle, Hund\'s rule','Electronic configuration; stability of half filled and completely filled orbitals'],
    concepts:[
      {t:'Heisenberg uncertainty principle', d:'It is impossible to determine simultaneously and exactly both the position and the momentum of an electron: Δx·Δp ≥ h/4π. This rules out well-defined Bohr orbits and leads to the idea of probability (orbitals).'},
      {t:'Quantum numbers', d:'n (principal, size and energy), l (azimuthal, shape, 0 to n−1), m (magnetic, orientation, −l to +l), s (spin, ±½). No two electrons in an atom can have all four the same (Pauli).'},
      {t:'Hund\'s rule', d:'Pairing of electrons in orbitals of the same subshell does not occur until each orbital has one electron, and all such single electrons have parallel spin.'},
      {t:'Extra stability of half/fully filled', d:'Symmetrical distribution and greater exchange energy make d⁵ and d¹⁰ especially stable — hence Cr is 3d⁵4s¹ and Cu is 3d¹⁰4s¹.'}
    ],
    formulas:[
      {f:'E_n = −13.6/n² eV (H atom) ; r_n = 0.529n² Å', m:'Bohr model'},
      {f:'1/λ = R(1/n₁² − 1/n₂²)', m:'Spectral lines'},
      {f:'λ = h/mv ; Δx·Δp ≥ h/4π', m:'de Broglie and uncertainty'},
      {f:'Number of orbitals in a shell = n² ; electrons = 2n²', m:'Capacity'},
      {f:'Energy order by (n + l) rule', m:'Aufbau: lower (n+l) fills first; if equal, lower n first'}
    ],
    mistakes:['Writing Cr as 3d⁴4s² instead of 3d⁵4s¹.','Applying Bohr\'s model to multi-electron atoms.','Forgetting that 4s fills before 3d but is removed first on ionisation.'],
    questions:[
      {marks:2, q:'State Heisenberg\'s uncertainty principle. What is its significance?', a:'It is impossible to measure simultaneously and with complete accuracy both the position and momentum of a microscopic particle: Δx·Δp ≥ h/4π. Its significance is that the concept of a definite path or orbit for the electron, as in Bohr\'s model, is meaningless. We can only speak of the probability of finding an electron in a region of space — an orbital.'},
      {marks:2, q:'Why is the electronic configuration of chromium 3d⁵4s¹ and not 3d⁴4s²?', a:'Because exactly half-filled subshells have extra stability due to their symmetrical distribution of electrons and greater exchange energy. Promoting one 4s electron to 3d gives a half-filled 3d⁵ and a half-filled 4s¹, which is lower in energy than 3d⁴4s².'}
    ]},
  { id:'c11-3', unit:3, name:'Classification of Elements and Periodicity in Properties', marks:'—',
    topics:['Significance of classification; modern periodic law and the periodic table','Periodic trends: atomic and ionic radii, ionisation enthalpy, electron gain enthalpy, electronegativity, valence','Nomenclature of elements with atomic number greater than 100'],
    concepts:[
      {t:'Ionisation enthalpy trends', d:'Increases across a period (nuclear charge rises, size falls) and decreases down a group. Exceptions: Be > B and N > O because of stable filled/half-filled configurations.'},
      {t:'Electron gain enthalpy', d:'Becomes more negative across a period. Cl has a more negative value than F because F is very small and inter-electronic repulsion in its compact 2p subshell opposes the incoming electron.'},
      {t:'Diagonal relationship', d:'Li–Mg, Be–Al, B–Si show similar properties because the increase in size down a group is offset by the increase in charge density across a period.'}
    ],
    formulas:[
      {f:'Z_eff = Z − σ', m:'Effective nuclear charge (Slater)'},
      {f:'Electronegativity: F > O > N ≈ Cl', m:'Pauling scale order'}
    ],
    mistakes:['Assuming ionisation energy increases uniformly across a period — remember the Be/B and N/O anomalies.','Saying fluorine has the most negative electron gain enthalpy (it is chlorine).'],
    questions:[
      {marks:3, q:'Explain why the first ionisation enthalpy of nitrogen is greater than that of oxygen.', a:'Nitrogen has the configuration 1s²2s²2p³ with a half-filled 2p subshell, which is symmetrical and extra stable, so removing an electron requires more energy. Oxygen is 1s²2s²2p⁴; removal of one electron gives the stable half-filled 2p³ configuration, and the paired electrons in one 2p orbital already experience inter-electronic repulsion. Hence oxygen loses an electron more easily despite its higher nuclear charge.'}
    ]},
  { id:'c11-4', unit:4, name:'Chemical Bonding and Molecular Structure', marks:'—',
    topics:['Valence electrons; ionic bond; covalent bond; bond parameters','Lewis structures; polar character of covalent bond; covalent character of ionic bond','VSEPR theory and geometry of simple molecules','Valence bond theory; hybridisation involving s, p and d orbitals; resonance','Molecular orbital theory of homonuclear diatomic molecules','Hydrogen bonding'],
    concepts:[
      {t:'VSEPR theory', d:'Electron pairs around the central atom arrange themselves as far apart as possible. Repulsion order: lone pair–lone pair > lone pair–bond pair > bond pair–bond pair. This explains why NH₃ (107°) and H₂O (104.5°) have angles less than 109.5°.'},
      {t:'Fajans\' rules', d:'Covalent character of an ionic bond increases with small cation size, large anion size, high charge on either ion, and a pseudo noble gas configuration of the cation.'},
      {t:'Bond order (MOT)', d:'BO = (N_b − N_a)/2. Higher bond order means greater bond dissociation energy and shorter bond length. Molecules with unpaired electrons in molecular orbitals (like O₂) are paramagnetic.'},
      {t:'Hydrogen bonding', d:'An attraction between H bonded to a small highly electronegative atom (F, O, N) and a lone pair on another such atom. Explains the high boiling point of water, the anomalous density of ice, and why HF is a weak acid.'}
    ],
    formulas:[
      {f:'Bond order = (N_b − N_a)/2', m:'Molecular orbital theory'},
      {f:'μ = q × d (Debye)', m:'Dipole moment'},
      {f:'sp linear 180° · sp² trigonal planar 120° · sp³ tetrahedral 109.5° · sp³d trigonal bipyramidal · sp³d² octahedral', m:'Hybridisation and geometry'}
    ],
    mistakes:['Predicting molecular shape from the total electron pairs instead of the bond pairs (BeCl₂ vs H₂O).','Forgetting that O₂ is paramagnetic — this is MOT\'s great success.','Assuming a symmetrical molecule with polar bonds has a dipole moment (CO₂ and CCl₄ have μ = 0).'],
    questions:[
      {marks:3, q:'Using VSEPR theory, explain why the bond angle in H₂O (104.5°) is less than in NH₃ (107°), which is less than in CH₄ (109.5°).', a:'All three have sp³ hybridisation with four electron pairs. CH₄ has four bond pairs and no lone pair, so the regular tetrahedral angle of 109.5° is retained. NH₃ has one lone pair, which occupies more space and repels the bond pairs more strongly, compressing the angle to 107°. H₂O has two lone pairs, so lone pair–lone pair repulsion compresses the angle further to 104.5°.'},
      {marks:3, q:'Draw the molecular orbital energy diagram of O₂ and explain its paramagnetic character.', a:'O₂ has 16 electrons. Configuration: σ1s² σ*1s² σ2s² σ*2s² σ2p_z² π2p_x² = π2p_y² π*2p_x¹ = π*2p_y¹. The two π* orbitals each hold one electron with parallel spins (Hund\'s rule), so O₂ has two unpaired electrons and is paramagnetic — a fact valence bond theory cannot explain. Bond order = (10 − 6)/2 = 2, consistent with a double bond.'}
    ]},
  { id:'c11-5', unit:5, name:'States of Matter: Gases and Liquids', marks:'—',
    topics:['Three states of matter; intermolecular interactions','Gas laws: Boyle\'s, Charles\', Gay-Lussac\'s, Avogadro\'s law','Ideal gas equation; Dalton\'s law of partial pressures','Kinetic molecular theory of gases; deviation from ideal behaviour','van der Waals equation; liquefaction of gases; critical constants','Liquid state: vapour pressure, viscosity and surface tension'],
    concepts:[
      {t:'Deviation from ideal behaviour', d:'Real gases deviate because molecules do have volume and do attract one another. Deviation is greatest at high pressure and low temperature. The compressibility factor Z = PV/nRT is 1 for an ideal gas.'},
      {t:'Boyle temperature', d:'The temperature at which a real gas behaves ideally over an appreciable range of pressure.'},
      {t:'Critical temperature', d:'The temperature above which a gas cannot be liquefied however great the pressure. Gases with higher T_c (like NH₃, CO₂) are easier to liquefy.'}
    ],
    formulas:[
      {f:'PV = nRT ; R = 0.0821 L atm K⁻¹ mol⁻¹ = 8.314 J K⁻¹ mol⁻¹', m:'Ideal gas equation'},
      {f:'(P + an²/V²)(V − nb) = nRT', m:'van der Waals equation'},
      {f:'Z = PV/nRT', m:'Compressibility factor'},
      {f:'P_total = p₁ + p₂ + … ; p_i = x_i P_total', m:'Dalton\'s law'},
      {f:'r₁/r₂ = √(M₂/M₁)', m:'Graham\'s law of diffusion'}
    ],
    mistakes:['Using the wrong value of R for the units given.','Forgetting to use absolute temperature in gas laws.'],
    questions:[
      {marks:3, q:'Explain the significance of the constants a and b in the van der Waals equation.', a:'\'a\' measures the magnitude of intermolecular attractive forces; the term an²/V² is added to the observed pressure because attractions make the molecules strike the walls with less force than in an ideal gas. \'b\' is the excluded volume (four times the actual volume of the molecules per mole); it is subtracted because the molecules themselves occupy space, so the free volume available is less than V. Higher \'a\' means the gas is more easily liquefied.'}
    ]},
  { id:'c11-6', unit:6, name:'Chemical Thermodynamics', marks:'—',
    topics:['System and surroundings; types of system; state functions','Work, heat, internal energy; first law of thermodynamics','Enthalpy; heat capacity; Hess\'s law of constant heat summation','Enthalpies of formation, combustion, neutralisation, bond dissociation, atomisation, solution','Spontaneity; entropy; Gibbs energy; criteria for spontaneity','Second and third laws of thermodynamics (brief)'],
    concepts:[
      {t:'State function', d:'A property depending only on the state of the system, not the path — U, H, S, G, P, V, T. Work and heat are path functions.'},
      {t:'Hess\'s law', d:'The total enthalpy change of a reaction is the same whether it occurs in one step or several. A consequence of enthalpy being a state function.'},
      {t:'Gibbs energy criterion', d:'ΔG = ΔH − TΔS. A process is spontaneous if ΔG < 0, at equilibrium if ΔG = 0, and non-spontaneous if ΔG > 0.'},
      {t:'Third law', d:'The entropy of a perfectly crystalline substance is zero at absolute zero.'}
    ],
    formulas:[
      {f:'ΔU = q + w ; w = −P_ext ΔV', m:'First law'},
      {f:'ΔH = ΔU + ΔnRT', m:'Relation between ΔH and ΔU'},
      {f:'ΔH = ΣΔH_f(products) − ΣΔH_f(reactants)', m:'Hess\'s law application'},
      {f:'ΔG = ΔH − TΔS ; ΔG° = −RT ln K', m:'Gibbs energy'},
      {f:'ΔS = q_rev/T', m:'Entropy change'}
    ],
    mistakes:['Sign convention: work done ON the system is positive in the modern convention.','Forgetting Δn refers to moles of gaseous species only.'],
    questions:[
      {marks:3, q:'State Hess\'s law and explain its usefulness.', a:'The total enthalpy change of a reaction is the same whether it takes place in one step or in several steps, provided the initial and final conditions are the same. This follows from enthalpy being a state function. It is useful for calculating enthalpy changes that cannot be measured directly — for example the enthalpy of formation of carbon monoxide, which cannot be measured because some CO₂ always forms, but can be obtained by subtracting the combustion enthalpies.'},
      {marks:2, q:'For a reaction ΔH = +30 kJ and ΔS = +100 J K⁻¹. At what temperature does it become spontaneous?', a:'ΔG = ΔH − TΔS. The reaction becomes spontaneous when ΔG < 0, i.e. T > ΔH/ΔS = 30000/100 = 300 K. Below 300 K it is non-spontaneous; at exactly 300 K the system is at equilibrium.'}
    ]},
  { id:'c11-7', unit:7, name:'Equilibrium', marks:'—',
    topics:['Equilibrium in physical and chemical processes; dynamic nature of equilibrium','Law of mass action; equilibrium constant; factors affecting equilibrium; Le Chatelier\'s principle','Ionic equilibrium: ionisation of acids and bases; strong and weak electrolytes; degree of ionisation','Concept of pH; buffer solutions; solubility product; common ion effect','Hydrolysis of salts'],
    concepts:[
      {t:'Le Chatelier\'s principle', d:'If a system at equilibrium is disturbed by a change in concentration, pressure or temperature, the equilibrium shifts in the direction that tends to undo the change.'},
      {t:'Buffer solution', d:'A solution that resists change in pH on adding small amounts of acid or base. Acidic buffer: weak acid + its salt (CH₃COOH + CH₃COONa). Basic buffer: weak base + its salt (NH₄OH + NH₄Cl).'},
      {t:'Common ion effect', d:'The suppression of the ionisation of a weak electrolyte by adding a strong electrolyte with a common ion. Used in qualitative analysis, e.g. NH₄Cl added before NH₄OH to precipitate only Group III hydroxides.'},
      {t:'Solubility product', d:'For a sparingly soluble salt, K_sp is the product of the ionic concentrations in a saturated solution, each raised to its stoichiometric power. Precipitation occurs when the ionic product exceeds K_sp.'}
    ],
    formulas:[
      {f:'K_c = [products]^n/[reactants]^m ; K_p = K_c(RT)^{Δn}', m:'Equilibrium constants'},
      {f:'pH = −log[H⁺] ; pH + pOH = 14', m:'pH scale'},
      {f:'pH = pK_a + log([salt]/[acid])', m:'Henderson–Hasselbalch equation'},
      {f:'K_a = cα²/(1 − α) ; α = √(K_a/c)', m:'Ostwald dilution law'},
      {f:'K_sp = s² (AB) ; 4s³ (AB₂) ; 27s⁴ (AB₃)', m:'Solubility product'}
    ],
    mistakes:['Forgetting that K_p = K_c only when Δn = 0.','Including pure solids and liquids in the equilibrium constant expression.','Applying Le Chatelier\'s pressure argument when Δn = 0 (no shift occurs).'],
    questions:[
      {marks:3, q:'Apply Le Chatelier\'s principle to the Haber process, N₂ + 3H₂ ⇌ 2NH₃, ΔH = −92 kJ. State the optimum conditions.', a:'The forward reaction is exothermic and proceeds with a decrease in the number of gaseous moles (4 → 2). By Le Chatelier: (i) high pressure favours the forward reaction, so about 200 atm is used; (ii) low temperature favours it, but the rate would be too slow, so a moderate 700 K is used as a compromise; (iii) removing ammonia as it forms shifts the equilibrium forward. A catalyst (finely divided iron with molybdenum promoter) increases the rate but does not shift the equilibrium.'},
      {marks:3, q:'What is a buffer solution? Derive the Henderson equation for an acidic buffer.', a:'A buffer resists change in pH on dilution or on adding a small amount of acid or base. For a weak acid HA and its salt: K_a = [H⁺][A⁻]/[HA]. Since the acid is weakly ionised and the salt fully ionised, [HA] ≈ [acid] and [A⁻] ≈ [salt]. So [H⁺] = K_a[acid]/[salt]. Taking negative logarithms: pH = pK_a + log([salt]/[acid]). The buffer is most effective when [salt] = [acid], i.e. pH = pK_a.'}
    ]},
  { id:'c11-8', unit:8, name:'Redox Reactions', marks:'—',
    topics:['Concept of oxidation and reduction; electron transfer','Oxidation number; balancing redox reactions by oxidation number and half reaction methods','Redox reactions in terms of loss and gain of electrons','Applications of redox reactions'],
    concepts:[
      {t:'Oxidation number', d:'The apparent charge an atom would have if all bonds were fully ionic. Free elements have zero; the sum over a neutral molecule is zero; over an ion it equals the charge.'},
      {t:'Disproportionation', d:'A reaction in which the same species is simultaneously oxidised and reduced, e.g. 2H₂O₂ → 2H₂O + O₂, or Cl₂ + 2OH⁻ → Cl⁻ + ClO⁻ + H₂O.'}
    ],
    formulas:[
      {f:'Oxidation = loss of electrons = increase in oxidation number', m:'OIL RIG'},
      {f:'Equivalent mass = molar mass / change in oxidation number per formula unit', m:'Redox titration'}
    ],
    mistakes:['Forgetting that oxygen is −1 in peroxides and +2 in OF₂.','Not balancing charge as well as atoms in ionic equations.'],
    questions:[
      {marks:2, q:'Balance in acidic medium: MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺.', a:'Reduction half: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O. Oxidation half: Fe²⁺ → Fe³⁺ + e⁻. Multiply the oxidation half by 5 and add: MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O.'}
    ]},
  { id:'c11-9', unit:9, name:'Hydrogen and s-Block Elements', marks:'—',
    topics:['Hydrogen: position in the periodic table, isotopes, preparation, properties and uses','Hydrides: ionic, covalent and interstitial','Water: structure, hard and soft water, methods of removal of hardness; heavy water; hydrogen peroxide','Group 1 and Group 2: electronic configuration, occurrence, anomalous properties of the first element','Diagonal relationship; trends in properties of compounds','Preparation and properties of NaOH, Na₂CO₃, NaHCO₃, NaCl; CaO, Ca(OH)₂, CaCO₃, plaster of Paris','Biological importance of Na, K, Mg and Ca'],
    concepts:[
      {t:'Anomalous behaviour of Li and Be', d:'Very small size, high charge density, high polarising power and absence of d orbitals make them differ from the rest of their groups and resemble Mg and Al respectively (diagonal relationship).'},
      {t:'Hardness of water', d:'Temporary hardness is due to bicarbonates of Ca and Mg (removed by boiling or Clark\'s method with lime). Permanent hardness is due to chlorides and sulphates (removed by washing soda, ion exchange or Calgon).'},
      {t:'Plaster of Paris', d:'CaSO₄·½H₂O, obtained by heating gypsum to 393 K. On mixing with water it sets to a hard mass of gypsum; used in plaster casts and for making moulds.'}
    ],
    formulas:[
      {f:'CaSO₄·2H₂O →(393 K) CaSO₄·½H₂O →(above 393 K) CaSO₄ (dead burnt)', m:'Plaster of Paris'},
      {f:'Na₂CO₃·10H₂O (washing soda) ; NaHCO₃ (baking soda)', m:'Solvay process products'},
      {f:'Ca(HCO₃)₂ + Ca(OH)₂ → 2CaCO₃↓ + 2H₂O', m:'Clark\'s method for temporary hardness'}
    ],
    mistakes:['Confusing which hardness is removed by boiling (temporary only).','Forgetting that Li is the strongest reducing agent in solution despite its high ionisation energy (because of very high hydration energy).'],
    questions:[
      {marks:3, q:'What is the diagonal relationship? Give two similarities between lithium and magnesium.', a:'Elements of the second period resemble the element diagonally below and to the right in the third period, because the increase in size down a group is offset by the decrease in size across a period, giving similar charge density and polarising power. Li and Mg: (i) both form nitrides directly with nitrogen (Li₃N, Mg₃N₂), unlike other alkali metals; (ii) their carbonates decompose on heating to give the oxide and CO₂, and both LiOH and Mg(OH)₂ are only sparingly soluble and decompose on heating.'}
    ]},
  { id:'c11-10', unit:10, name:'Some p-Block Elements (Groups 13 and 14)', marks:'—',
    topics:['General introduction to p-block; electronic configuration and general trends','Group 13: boron — physical and chemical properties; borax, boric acid, diborane; aluminium and its compounds','Group 14: carbon — allotropes, oxides; silicon, silicones, silicates and zeolites'],
    concepts:[
      {t:'Inert pair effect', d:'The reluctance of the ns² pair to take part in bonding down a group, due to poor shielding by intervening d and f electrons. Hence the +1 state becomes more stable than +3 down group 13 (Tl⁺ is stable).'},
      {t:'Electron deficient nature of BF₃', d:'Boron has only six electrons in the valence shell, so BF₃ is a strong Lewis acid. However, back donation from fluorine lone pairs into the empty 2p orbital of boron makes BF₃ a weaker Lewis acid than BCl₃.'},
      {t:'Catenation', d:'Carbon has an exceptional ability to form long chains and rings with itself, because of its small size and strong C–C bond (348 kJ/mol). This ability falls sharply down the group.'}
    ],
    formulas:[
      {f:'Na₂B₄O₇·10H₂O →Δ Na₂B₄O₇ → 2NaBO₂ + B₂O₃ (borax bead)', m:'Borax bead test'},
      {f:'H₃BO₃ →(370 K) HBO₂ →(Δ) B₂O₃', m:'Boric acid on heating'},
      {f:'B₂H₆ + 6H₂O → 2H₃BO₃ + 6H₂', m:'Diborane hydrolysis'}
    ],
    mistakes:['Writing boric acid as a protic acid — it is a Lewis acid, accepting OH⁻ from water.','Forgetting the banana (three centre two electron) bonds in diborane.'],
    questions:[
      {marks:2, q:'Why is boric acid considered a weak monobasic acid?', a:'Boric acid does not donate a proton of its own. Being electron deficient, it accepts a lone pair from a water molecule: B(OH)₃ + 2H₂O → [B(OH)₄]⁻ + H₃O⁺. It therefore behaves as a Lewis acid and releases only one H₃O⁺ per molecule, making it a weak monobasic acid.'}
    ]},
  { id:'c11-11', unit:11, name:'Organic Chemistry: Basic Principles and Techniques', marks:'—',
    topics:['Tetravalency of carbon; shapes of organic compounds; hybridisation','Classification and IUPAC nomenclature of organic compounds','Isomerism: structural and stereoisomerism','Electronic displacements: inductive effect, electromeric effect, resonance, hyperconjugation','Homolytic and heterolytic fission; free radicals, carbocations, carbanions; electrophiles and nucleophiles','Methods of purification and qualitative and quantitative analysis'],
    concepts:[
      {t:'Inductive effect', d:'Permanent polarisation of a sigma bond due to electronegativity difference, transmitted along a chain and dying out after three or four carbons. −I: NO₂ > CN > COOH > F > Cl; +I: alkyl groups.'},
      {t:'Resonance', d:'When a molecule cannot be represented by one Lewis structure, the real structure is a hybrid of several canonical forms. Resonance always lowers the energy and stabilises the molecule.'},
      {t:'Hyperconjugation', d:'Delocalisation of σ electrons of a C–H bond adjacent to an unsaturated system or a carbocation. More α-hydrogens means greater stability — this is why 3° carbocations and more substituted alkenes are the most stable.'},
      {t:'Carbocation stability', d:'3° > 2° > 1° > CH₃⁺, explained by the +I effect of alkyl groups and hyperconjugation. Benzyl and allyl cations are stabilised by resonance.'}
    ],
    formulas:[
      {f:'Stability of carbocations: 3° > 2° > 1° > methyl', m:'Hyperconjugation and +I'},
      {f:'Stability of free radicals: 3° > 2° > 1° > methyl', m:'Same reasons'},
      {f:'Stability of carbanions: methyl > 1° > 2° > 3°', m:'Reverse order'},
      {f:'Lassaigne\'s test: Na fusion → NaCN (N), Na₂S (S), NaX (halogen)', m:'Detection of elements'}
    ],
    mistakes:['Reversing the stability order for carbanions.','Confusing the inductive effect (permanent, σ) with the electromeric effect (temporary, π, only in presence of a reagent).'],
    questions:[
      {marks:3, q:'Explain hyperconjugation and use it to compare the stability of ethyl and tert-butyl carbocations.', a:'Hyperconjugation is the delocalisation of the electrons of a σ (C–H) bond on the carbon adjacent to a positively charged or unsaturated carbon into the empty p orbital. Each α-hydrogen provides one hyperconjugative structure, spreading the positive charge and stabilising the ion. The ethyl carbocation CH₃CH₂⁺ has 3 α-hydrogens, while the tert-butyl carbocation (CH₃)₃C⁺ has 9. Hence the tert-butyl cation is far more stable.'}
    ]},
  { id:'c11-12', unit:12, name:'Hydrocarbons', marks:'—',
    topics:['Alkanes: nomenclature, isomerism, conformations of ethane, mechanism of halogenation','Alkenes: structure of the double bond, geometrical isomerism, preparation, mechanism of electrophilic addition, Markovnikov\'s rule, peroxide effect','Alkynes: structure of the triple bond, preparation, acidic character of terminal alkynes','Aromatic hydrocarbons: benzene, resonance, aromaticity, mechanism of electrophilic substitution, directive influence of substituents','Carcinogenicity and toxicity'],
    concepts:[
      {t:'Markovnikov\'s rule', d:'In the addition of HX to an unsymmetrical alkene, the negative part attaches to the carbon with fewer hydrogens — because that route goes through the more stable carbocation.'},
      {t:'Peroxide effect (Kharasch)', d:'HBr adds anti-Markovnikov in the presence of peroxides because the reaction goes by a free radical mechanism, and the more stable radical is formed. Only HBr shows it — HCl\'s bond is too strong and HI\'s too weak.'},
      {t:'Aromaticity (Hückel\'s rule)', d:'A compound is aromatic if it is cyclic, planar, fully conjugated and has (4n + 2) π electrons.'},
      {t:'Directive influence', d:'Activating groups (–OH, –NH₂, –CH₃, halogens) direct to ortho and para; deactivating groups (–NO₂, –COOH, –CN, –SO₃H) direct to meta. Halogens are the exception — deactivating but ortho/para directing.'}
    ],
    formulas:[
      {f:'CH₃COONa + NaOH/CaO → CH₄ + Na₂CO₃', m:'Decarboxylation'},
      {f:'2CH₃X + 2Na (dry ether) → CH₃CH₃', m:'Wurtz reaction'},
      {f:'CaC₂ + 2H₂O → C₂H₂ + Ca(OH)₂', m:'Acetylene from calcium carbide'},
      {f:'3C₂H₂ →(red hot Fe tube, 873 K) C₆H₆', m:'Benzene by cyclic polymerisation'},
      {f:'Alkene + O₃, then Zn/H₂O → carbonyl compounds', m:'Ozonolysis — locates the double bond'},
      {f:'C₆H₆ + HNO₃/H₂SO₄ (330 K) → C₆H₅NO₂', m:'Nitration; electrophile is NO₂⁺'}
    ],
    mistakes:['Applying the peroxide effect to HCl or HI.','Forgetting that halogens are ortho/para directing though deactivating.','Missing that terminal alkynes are acidic (they give a precipitate with ammoniacal AgNO₃) but internal ones are not.'],
    questions:[
      {marks:3, q:'State Markovnikov\'s rule and explain the mechanism of addition of HBr to propene.', a:'When an unsymmetrical reagent adds to an unsymmetrical alkene, the negative part attaches to the carbon carrying the smaller number of hydrogen atoms. Mechanism: H⁺ from HBr attacks the double bond. It can add to C1 giving a 2° carbocation, or to C2 giving a 1° carbocation. The 2° carbocation is more stable, so it forms preferentially. Br⁻ then attacks it, giving 2-bromopropane as the major product.'},
      {marks:2, q:'Why is benzene highly stable and why does it prefer substitution over addition?', a:'The six π electrons are completely delocalised over all six carbon atoms, giving a resonance energy of about 152 kJ/mol. Addition would destroy this delocalisation and the aromatic stability, whereas electrophilic substitution replaces a hydrogen and preserves the aromatic sextet. Hence benzene undergoes substitution rather than addition.'}
    ]}
  ]}
  }
};
