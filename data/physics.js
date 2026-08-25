/* ISC Physics (861) — Class XI & XII. Data © structure by Study Mate. */
window.SM = window.SM || {subjects:{}};
window.SM.subjects.physics = {
  id:'physics', name:'Physics', code:'861', icon:'⚛', colour:'#4f7cff',
  pattern:'Paper I Theory 70 marks (3 hrs) · Paper II Practical 15 + Project 10 + Practical File 5 = 30 marks',
  classes:{
  12:{ groups:[
    {marks:14, units:[1,2]}, {marks:16, units:[3,4]}, {marks:2, units:[5]},
    {marks:18, units:[6]}, {marks:7, units:[7]}, {marks:6, units:[8]}, {marks:7, units:[9]}
  ],
  chapters:[
  { id:'p12-1', unit:1, name:'Electrostatics', marks:'14 (with Current Electricity)',
    topics:['Electric charges; conservation and quantisation','Coulomb\'s law in vector form; superposition','Electric field, field lines, field due to point charge and dipole','Electric dipole; torque on dipole in uniform field','Gauss\'s theorem and applications: infinite wire, infinite plane sheet, spherical shell','Electric potential, potential difference, potential due to point charge and dipole','Equipotential surfaces; potential energy of a system of charges','Conductors and insulators; free charges and bound charges','Dielectrics, polarisation, dielectric constant','Capacitance; parallel plate capacitor with and without dielectric','Capacitors in series and parallel; energy stored'],
    concepts:[
      {t:'Quantisation of charge', d:'Any charge q = ne where n is an integer and e = 1.6×10⁻¹⁹ C. Charge is also conserved and is a scalar, invariant with speed.'},
      {t:'Coulomb\'s law', d:'Force between two point charges is directly proportional to the product of charges and inversely proportional to the square of the distance, acting along the line joining them. Valid only for point charges at rest.'},
      {t:'Superposition principle', d:'The force on a charge due to several charges is the vector sum of the forces due to each acting alone. Each pair force is unaffected by the presence of others.'},
      {t:'Electric field lines', d:'Start on +ve, end on −ve charge; never intersect; density gives field strength; always perpendicular to a conductor surface; no closed loops in electrostatics.'},
      {t:'Gauss\'s theorem', d:'Total electric flux through a closed surface equals 1/ε₀ times the net charge enclosed. Independent of the shape of the surface and of charges outside it.'},
      {t:'Electric potential', d:'Work done per unit positive test charge in bringing it from infinity to that point without acceleration. Scalar quantity, unit volt.'},
      {t:'Equipotential surface', d:'Surface with the same potential everywhere. No work is done in moving a charge on it; E is always perpendicular to it.'},
      {t:'Behaviour of conductors', d:'Inside a conductor E = 0, net charge resides on the surface, the whole conductor is an equipotential, and E just outside is σ/ε₀ normal to the surface.'},
      {t:'Dielectric and polarisation', d:'On applying a field, a dielectric develops a net dipole moment per unit volume (polarisation P). This reduces the net field inside to E₀/K, where K is the dielectric constant.'}
    ],
    formulas:[
      {f:'F = (1/4πε₀)·q₁q₂/r²', m:'Coulomb force; 1/4πε₀ = 9×10⁹ N m² C⁻²'},
      {f:'E = F/q₀ = (1/4πε₀)·q/r²', m:'Field due to a point charge'},
      {f:'p = q(2a)', m:'Dipole moment; direction −q → +q'},
      {f:'E_axial = (1/4πε₀)·2p/r³ ; E_equatorial = (1/4πε₀)·p/r³', m:'Short dipole (r ≫ a)'},
      {f:'τ = pE sinθ  (τ⃗ = p⃗ × E⃗)', m:'Torque on a dipole'},
      {f:'U = −pE cosθ', m:'PE of dipole in uniform field'},
      {f:'φ = ∮E⃗·dS⃗ = q_enc/ε₀', m:'Gauss\'s theorem'},
      {f:'E = λ/(2πε₀r)', m:'Infinite line charge'},
      {f:'E = σ/(2ε₀)', m:'Infinite plane sheet'},
      {f:'E = σ/ε₀', m:'Just outside a charged conductor'},
      {f:'V = (1/4πε₀)·q/r', m:'Potential of a point charge'},
      {f:'V = (1/4πε₀)·p cosθ/r²', m:'Potential due to a short dipole'},
      {f:'U = (1/4πε₀)·q₁q₂/r₁₂', m:'PE of a two-charge system'},
      {f:'C = Q/V ; C = ε₀A/d ; C = Kε₀A/d', m:'Capacitance; parallel plate, with dielectric'},
      {f:'C = ε₀A / (d − t + t/K)', m:'Slab of thickness t partially filling the gap'},
      {f:'Series: 1/C = 1/C₁ + 1/C₂ … ; Parallel: C = C₁ + C₂ …', m:'Combinations'},
      {f:'U = ½CV² = ½QV = Q²/2C', m:'Energy stored'},
      {f:'u = ½ε₀E²', m:'Energy density of the field'}
    ],
    mistakes:['Adding electric fields as scalars — E is a vector, add components.','Forgetting that Gauss\'s law gives the field only when the charge distribution is symmetric.','Using V = kq/r for a dipole point without the cosθ factor.','Assuming charge on a capacitor stays constant when the battery remains connected — the voltage stays constant instead.','Writing dipole moment direction from + to − (it is − to +).'],
    questions:[
      {marks:2, q:'Define electric flux. Write its SI unit.', a:'Electric flux through a surface is the total number of field lines crossing it, φ = ∮E⃗·dS⃗ = EA cosθ. SI unit: N m² C⁻¹ (or V·m). It is a scalar.'},
      {marks:3, q:'Using Gauss\'s theorem, derive the electric field due to an infinitely long straight uniformly charged wire.', a:'Take a coaxial cylindrical Gaussian surface of radius r and length l. Flux through the flat ends is zero (E⃗ ⟂ dS⃗). Curved surface: φ = E·2πrl. Charge enclosed = λl. By Gauss, E·2πrl = λl/ε₀, giving E = λ/(2πε₀r), directed radially outward for +λ. Note E ∝ 1/r, not 1/r².'},
      {marks:3, q:'Derive an expression for the torque on an electric dipole in a uniform electric field.', a:'Forces +qE and −qE act on the charges — equal, opposite and non-collinear, so net force is zero but a couple acts. Torque = force × perpendicular distance = qE × 2a sinθ = pE sinθ. In vector form τ⃗ = p⃗ × E⃗. Torque is maximum (pE) at θ = 90° and zero at θ = 0° or 180°.'},
      {marks:5, q:'Derive the expression for the capacitance of a parallel plate capacitor with a dielectric slab of thickness t (t < d) inserted between the plates.', a:'Field in the air gap = E₀ = σ/ε₀; in the dielectric = E₀/K. Potential difference V = E₀(d − t) + (E₀/K)t = (σ/ε₀)[(d − t) + t/K]. With σ = Q/A, C = Q/V = ε₀A / [(d − t) + t/K]. When t = d this reduces to C = Kε₀A/d, and when K = 1 to C = ε₀A/d. Capacitance always increases on inserting a dielectric.'},
      {marks:2, q:'A parallel plate capacitor is charged and then the battery is disconnected. A dielectric is now inserted. What happens to charge, field, potential difference and energy?', a:'Charge Q stays constant. Capacitance becomes KC, so V drops to V/K and E drops to E/K. Energy U = Q²/2C becomes U/K, i.e. it decreases — the deficit is the work done by the capacitor in pulling the slab in.'},
      {marks:3, q:'Show that the electric field is always normal to the surface of a charged conductor and that E = 0 inside it.', a:'If E had a tangential component, free charges would move along the surface, contradicting electrostatic equilibrium; hence E is normal. Inside, take a Gaussian surface just under the surface: no charge is enclosed (all charge resides on the surface), so flux = 0, hence E = 0 everywhere inside. Consequently the entire conductor is an equipotential volume.'}
    ]},

  { id:'p12-2', unit:2, name:'Current Electricity', marks:'14 (with Electrostatics)',
    topics:['Electric current, drift velocity, mobility, relation with current','Ohm\'s law, resistance, resistivity, conductivity','V–I characteristics: ohmic and non-ohmic','Temperature dependence of resistance','Electrical energy and power','Series and parallel combination of resistors','emf, internal resistance, terminal potential difference','Cells in series and parallel','Kirchhoff\'s laws and their applications','Wheatstone bridge, metre bridge','Potentiometer: comparison of emfs, internal resistance'],
    concepts:[
      {t:'Drift velocity', d:'The small average velocity (~10⁻⁴ m/s) acquired by free electrons in the direction opposite to the applied field, superposed on their random thermal motion.'},
      {t:'Why current flows instantly', d:'The electric field is set up throughout the conductor at nearly the speed of light, so all electrons start drifting almost simultaneously — the drift speed itself is tiny.'},
      {t:'Ohm\'s law', d:'At constant physical conditions (especially temperature), current through a conductor is proportional to the potential difference across it. It is not a fundamental law; many devices are non-ohmic.'},
      {t:'Resistivity', d:'ρ = m/(ne²τ) — a property of the material, independent of dimensions. For metals ρ increases with temperature (τ decreases); for semiconductors it decreases (n increases sharply).'},
      {t:'emf vs terminal p.d.', d:'emf is the work done per unit charge by the source in a complete circuit (open circuit value). Terminal p.d. V = ε − Ir while discharging, and V = ε + Ir while charging.'},
      {t:'Kirchhoff\'s junction rule', d:'Σ I = 0 at a junction — a consequence of conservation of charge.'},
      {t:'Kirchhoff\'s loop rule', d:'Σ ΔV = 0 around a closed loop — a consequence of conservation of energy.'},
      {t:'Why a potentiometer is better than a voltmeter', d:'At balance it draws no current from the cell, so it measures the true emf. A voltmeter always draws some current and reads terminal p.d., which is less than emf.'}
    ],
    formulas:[
      {f:'I = q/t = nAev_d', m:'Current in terms of drift velocity'},
      {f:'v_d = eEτ/m ; μ = v_d/E', m:'Drift velocity and mobility'},
      {f:'R = ρl/A ; σ = 1/ρ', m:'Resistance, conductivity'},
      {f:'J = I/A = σE', m:'Current density (microscopic Ohm\'s law)'},
      {f:'ρ_t = ρ₀(1 + αΔT)', m:'Temperature dependence'},
      {f:'P = VI = I²R = V²/R', m:'Power'},
      {f:'Series R = R₁+R₂… ; Parallel 1/R = 1/R₁+1/R₂…', m:'Combinations'},
      {f:'V = ε − Ir ; I = ε/(R+r)', m:'Cell with internal resistance'},
      {f:'n cells in series: I = nε/(R+nr) ; m in parallel: I = ε/(R + r/m)', m:'Grouping of cells'},
      {f:'P/Q = R/S', m:'Wheatstone balance condition'},
      {f:'R/S = l/(100−l)', m:'Metre bridge'},
      {f:'ε₁/ε₂ = l₁/l₂ ; r = R(l₁−l₂)/l₂', m:'Potentiometer: emf comparison, internal resistance'}
    ],
    mistakes:['Confusing drift velocity with the speed of the electrical signal.','Using ε instead of V (terminal p.d.) in circuit calculations.','Forgetting sign conventions when applying Kirchhoff\'s loop rule.','Assuming a metre bridge wire has zero end resistance.','Connecting the potentiometer with the driving cell emf less than the emf to be measured — no balance point is then possible.'],
    questions:[
      {marks:3, q:'Derive the relation I = nAev_d.', a:'Let n be the free electron density, A the cross-section, v_d the drift velocity. In time Δt, electrons within length v_dΔt cross a section. Number = nAv_dΔt, charge = neAv_dΔt. Hence I = q/Δt = nAev_d.'},
      {marks:3, q:'Deduce Ohm\'s law from the free electron model and obtain ρ = m/(ne²τ).', a:'v_d = eEτ/m. So I = nAe(eEτ/m) = (ne²τA/m)·(V/l). Therefore V/I = ml/(ne²τA) = R, a constant at constant temperature — this is Ohm\'s law. Comparing with R = ρl/A gives ρ = m/(ne²τ).'},
      {marks:3, q:'State and explain the balance condition of a Wheatstone bridge using Kirchhoff\'s laws.', a:'At balance the galvanometer current is zero, so B and D are at the same potential. Applying the loop rule to loop ABDA: I₁P = I₂R. For loop BCDB: I₁Q = I₂S. Dividing: P/Q = R/S. The bridge is most sensitive when all four resistances are of the same order.'},
      {marks:2, q:'Why is a potentiometer preferred over a voltmeter for measuring emf?', a:'At the balance point the potentiometer draws no current from the cell, so no potential drop occurs across the internal resistance and it measures the true emf. A voltmeter draws current and hence reads the terminal p.d., which is smaller than emf.'},
      {marks:5, q:'With a circuit diagram, explain how a potentiometer is used to measure the internal resistance of a cell.', a:'Connect the cell across the potentiometer through a key and a resistance box R with a shunt key. (i) With the shunt key open, balance length l₁ ∝ ε. (ii) Close the key with resistance R; the cell now supplies current and the terminal p.d. V gives balance length l₂ ∝ V. Since ε/V = l₁/l₂ and V = εR/(R+r), we get r = R(l₁ − l₂)/l₂.'},
      {marks:2, q:'Explain why resistivity of a semiconductor decreases with rise in temperature.', a:'ρ = m/(ne²τ). In a semiconductor a temperature rise breaks many covalent bonds, so n increases exponentially. This dominates the small decrease in τ, hence ρ falls sharply — a negative temperature coefficient of resistance.'}
    ]},

  { id:'p12-3', unit:3, name:'Magnetic Effects of Current and Magnetism', marks:'16 (with EMI & AC)',
    topics:['Oersted\'s experiment; Biot–Savart law','Field on the axis of a circular loop','Ampere\'s circuital law; straight wire, solenoid, toroid','Force on a moving charge; Lorentz force; cyclotron','Force on a current-carrying conductor; force between parallel currents; definition of ampere','Torque on a current loop; magnetic dipole moment','Moving coil galvanometer; conversion to ammeter and voltmeter','Current loop as a magnetic dipole; bar magnet as a solenoid','Magnetic field lines; earth\'s magnetic field','Para-, dia- and ferromagnetic substances; hysteresis'],
    concepts:[
      {t:'Biot–Savart law', d:'The field due to a current element is proportional to I dl sinθ / r², directed perpendicular to both dl⃗ and r⃗ (given by dl⃗ × r̂).'},
      {t:'Ampere\'s circuital law', d:'∮B⃗·dl⃗ = μ₀I_enc. Useful only where symmetry lets B be taken constant along a chosen Amperian loop.'},
      {t:'Lorentz force', d:'F⃗ = q(E⃗ + v⃗ × B⃗). The magnetic part does no work since it is always perpendicular to v⃗ — it changes direction, never speed.'},
      {t:'Cyclotron', d:'Accelerates positive ions using a high-frequency alternating field across dees plus a perpendicular magnetic field. Cannot accelerate electrons (too light — relativistic mass change destroys resonance) or neutral particles.'},
      {t:'Moving coil galvanometer', d:'A coil in a radial magnetic field between concave pole pieces so the torque is always NIAB regardless of position, giving a linear scale. Sensitivity = NAB/k.'},
      {t:'Diamagnetism', d:'Feebly repelled by a magnet; no permanent dipole moment; χ small and negative; independent of temperature.'},
      {t:'Paramagnetism', d:'Feebly attracted; permanent dipole moments align partially; χ small, positive, and ∝ 1/T (Curie\'s law).'},
      {t:'Ferromagnetism', d:'Strongly attracted; domains align; χ large and positive; above the Curie temperature becomes paramagnetic. Shows hysteresis.'}
    ],
    formulas:[
      {f:'dB = (μ₀/4π)·I dl sinθ/r²', m:'Biot–Savart law; μ₀/4π = 10⁻⁷ T m A⁻¹'},
      {f:'B = μ₀I/2πr', m:'Long straight wire'},
      {f:'B = μ₀NI/2R (centre) ; B = μ₀NIR²/2(R²+x²)^{3/2} (axis)', m:'Circular coil'},
      {f:'B = μ₀nI (solenoid) ; B = μ₀NI/2πr (toroid)', m:'Solenoid and toroid'},
      {f:'F = qvB sinθ ; r = mv/qB ; T = 2πm/qB', m:'Charged particle in a magnetic field'},
      {f:'ν_c = qB/2πm ; KE_max = q²B²R²/2m', m:'Cyclotron frequency and maximum energy'},
      {f:'F = BIl sinθ', m:'Force on a conductor'},
      {f:'F/l = μ₀I₁I₂/2πd', m:'Force between parallel currents (attract if same direction)'},
      {f:'τ = NIAB sinθ ; m = NIA', m:'Torque on a loop; magnetic moment'},
      {f:'I_g G = (I − I_g)S', m:'Ammeter: shunt in parallel'},
      {f:'R = V/I_g − G', m:'Voltmeter: high resistance in series'},
      {f:'B = μ₀(H + I) ; μ_r = 1 + χ', m:'Magnetisation relations'}
    ],
    mistakes:['Applying Ampere\'s law where there is no symmetry.','Forgetting that the magnetic force does no work.','Mixing up shunt (ammeter, parallel, low) and multiplier (voltmeter, series, high).','Assuming a cyclotron can accelerate electrons or neutrons.','Confusing χ (susceptibility) with μ_r (relative permeability).'],
    questions:[
      {marks:3, q:'Using the Biot–Savart law, derive the magnetic field at the centre of a circular current-carrying coil.', a:'For an element dl at the centre, r⃗ ⟂ dl⃗ so θ = 90°. dB = (μ₀/4π)·I dl/R². All elements give fields in the same direction (along the axis), so B = (μ₀I/4πR²)∮dl = (μ₀I/4πR²)(2πR) = μ₀I/2R. For N turns, B = μ₀NI/2R.'},
      {marks:3, q:'Derive the expression for the force per unit length between two long parallel current-carrying conductors and hence define the ampere.', a:'Wire 1 produces B₁ = μ₀I₁/2πd at wire 2. Force on length l of wire 2: F = B₁I₂l = μ₀I₁I₂l/2πd, so F/l = μ₀I₁I₂/2πd. The wires attract for parallel currents and repel for antiparallel. One ampere is the current which, when maintained in two infinitely long parallel conductors 1 m apart in vacuum, produces a force of 2×10⁻⁷ N per metre of length.'},
      {marks:5, q:'Describe the principle, construction and working of a cyclotron. State two limitations.', a:'Principle: a charged particle can be accelerated repeatedly through a moderate p.d. by making it cross the gap between two dees many times, since its period of revolution T = 2πm/qB is independent of speed and radius. Construction: two hollow D-shaped chambers in an evacuated chamber, placed in a strong perpendicular magnetic field, connected to a high-frequency oscillator. Working: the particle is accelerated in the gap, moves in a semicircle inside each dee (field-free region), and returns to the gap exactly when the polarity has reversed (resonance condition ν_osc = qB/2πm). Radius grows each time; finally KE_max = q²B²R²/2m. Limitations: (i) cannot accelerate neutral particles or electrons, (ii) at high speeds the relativistic mass increase breaks the resonance condition.'},
      {marks:2, q:'Why is the magnetic field radial in a moving coil galvanometer?', a:'A radial field (produced by concave pole pieces and a soft iron core) keeps the plane of the coil always parallel to the field, so θ = 90° and torque = NIAB always. This makes the deflection directly proportional to current, giving a linear scale.'},
      {marks:3, q:'Distinguish between diamagnetic, paramagnetic and ferromagnetic substances on the basis of susceptibility and behaviour in a non-uniform field.', a:'Diamagnetic: χ small and negative (−1 ≤ χ < 0), moves from strong to weak field, μ_r < 1, e.g. bismuth, copper. Paramagnetic: χ small and positive, moves weakly from weak to strong field, μ_r slightly > 1, χ ∝ 1/T, e.g. aluminium. Ferromagnetic: χ very large and positive, strongly attracted to the strong-field region, μ_r ≫ 1, shows hysteresis and a Curie point, e.g. iron, cobalt, nickel.'}
    ]},

  { id:'p12-4', unit:4, name:'Electromagnetic Induction and Alternating Currents', marks:'16 (with Unit 3)',
    topics:['Faraday\'s laws; induced emf and current; Lenz\'s law','Motional emf','Self inductance; mutual inductance','Energy stored in an inductor','AC: peak, mean and rms values','AC through resistor, inductor, capacitor','LCR series circuit; phasor diagram; impedance; resonance','Power in AC circuits; power factor; wattless current','AC generator; transformer'],
    concepts:[
      {t:'Faraday\'s law', d:'The magnitude of the induced emf equals the rate of change of magnetic flux linked with the circuit: ε = −N dφ/dt. The minus sign is Lenz\'s law.'},
      {t:'Lenz\'s law', d:'The induced effect always opposes the cause producing it. It is a statement of conservation of energy — mechanical work must be done against the opposing force to keep the flux changing.'},
      {t:'Eddy currents', d:'Circulating currents induced in bulk conductors. Reduced by laminating cores; used in induction furnaces, electromagnetic braking, speedometers.'},
      {t:'rms value', d:'The value of steady DC that produces the same heating effect in the same resistance over the same time. AC ammeters and voltmeters read rms values.'},
      {t:'Resonance in LCR', d:'At ω₀ = 1/√(LC), X_L = X_C, impedance is minimum (= R), current is maximum and in phase with voltage. Sharpness measured by Q = ω₀L/R.'},
      {t:'Wattless current', d:'In a purely inductive or purely capacitive circuit the phase difference is 90°, so cosφ = 0 and average power over a cycle is zero, even though current flows.'},
      {t:'Transformer', d:'Works on mutual induction; changes AC voltage. Losses: copper loss (thick wires), flux leakage (well-designed core), eddy currents (laminated core), hysteresis (soft iron core).'}
    ],
    formulas:[
      {f:'ε = −N dφ/dt ; φ = BA cosθ', m:'Faraday\'s law'},
      {f:'ε = Blv ; F = B²l²v/R', m:'Motional emf and retarding force'},
      {f:'ε = −L dI/dt ; L = μ₀n²Al (solenoid)', m:'Self inductance'},
      {f:'ε₂ = −M dI₁/dt ; M = μ₀n₁n₂Al', m:'Mutual inductance'},
      {f:'U = ½LI²', m:'Energy stored in an inductor'},
      {f:'I_rms = I₀/√2 ; I_mean = 2I₀/π (half cycle)', m:'AC values'},
      {f:'X_L = ωL ; X_C = 1/ωC', m:'Reactances'},
      {f:'Z = √(R² + (X_L − X_C)²) ; tanφ = (X_L − X_C)/R', m:'LCR series'},
      {f:'ω₀ = 1/√(LC) ; ν₀ = 1/(2π√(LC))', m:'Resonance'},
      {f:'Q = ω₀L/R = (1/R)√(L/C)', m:'Quality factor'},
      {f:'P_av = V_rms I_rms cosφ', m:'Average power; cosφ = R/Z is the power factor'},
      {f:'ε = NBAω sinωt', m:'AC generator'},
      {f:'V_s/V_p = N_s/N_p = I_p/I_s', m:'Ideal transformer'}
    ],
    mistakes:['Dropping the negative sign / misapplying Lenz\'s law direction.','Adding V_R, V_L, V_C algebraically instead of as phasors.','Using average power = VI without the power factor.','Assuming a transformer works on DC — it needs changing flux.','Confusing resonance frequency (1/2π√LC) with angular resonance frequency (1/√LC).'],
    questions:[
      {marks:3, q:'State Lenz\'s law and show that it is a consequence of conservation of energy.', a:'Lenz\'s law: the direction of the induced emf/current is such that it opposes the change producing it. If a magnet\'s N-pole approaches a coil, the near face becomes a N-pole and repels it. To keep moving the magnet, work must be done against this repulsion, and that work appears as electrical energy in the coil. If the induced current instead aided the motion, the magnet would accelerate on its own and energy would be created from nothing — violating conservation of energy.'},
      {marks:3, q:'Derive the expression for motional emf induced in a rod moving in a uniform magnetic field.', a:'A rod of length l moves with velocity v perpendicular to B. In time dt the area swept is lv dt, so dφ = Blv dt and ε = dφ/dt = Blv. Alternatively, the magnetic force qvB on the free electrons drives them to one end until the electrostatic field balances it: qE = qvB, so E = vB and ε = El = Blv.'},
      {marks:5, q:'Draw a phasor diagram for a series LCR circuit and derive the expression for impedance. State the condition for resonance.', a:'Take current I as reference. V_R is in phase with I, V_L leads by 90°, V_C lags by 90°. The net reactive voltage is (V_L − V_C). By Pythagoras, V = √(V_R² + (V_L − V_C)²) = I√(R² + (X_L − X_C)²). Hence Z = √(R² + (X_L − X_C)²) and tanφ = (X_L − X_C)/R. At resonance X_L = X_C, so ω₀L = 1/ω₀C giving ω₀ = 1/√(LC). Then Z = R (minimum), I is maximum and φ = 0.'},
      {marks:2, q:'Why is the core of a transformer laminated?', a:'A solid core would allow large eddy currents induced by the changing flux, dissipating energy as heat. Laminating the core with insulated sheets increases the resistance of eddy current paths and confines them to each thin sheet, greatly reducing this loss.'},
      {marks:2, q:'Define power factor. When is the power consumed in an AC circuit zero?', a:'Power factor cosφ = R/Z is the ratio of true power to apparent power. It is zero when the circuit is purely inductive or purely capacitive (φ = 90°), so no power is consumed — the current is then called a wattless current.'},
      {marks:3, q:'An AC generator: state its principle and derive the expression for the emf generated.', a:'Principle: electromagnetic induction — when a coil rotates in a uniform magnetic field, the flux linked with it changes continuously and an emf is induced. If the coil of N turns and area A rotates with angular velocity ω, flux φ = NBA cosωt. Hence ε = −dφ/dt = NBAω sinωt = ε₀ sinωt, where ε₀ = NBAω. The emf is sinusoidal and reverses direction every half rotation.'}
    ]},

  { id:'p12-5', unit:5, name:'Electromagnetic Waves', marks:'2',
    topics:['Displacement current (qualitative)','Electromagnetic waves and their characteristics (qualitative)','Transverse nature of electromagnetic waves','Complete electromagnetic spectrum: production, detection and uses'],
    concepts:[
      {t:'Displacement current', d:'Maxwell\'s correction: a changing electric field between capacitor plates is equivalent to a current I_d = ε₀ dφ_E/dt, which makes Ampere\'s law consistent. It restores continuity of current in a circuit containing a capacitor.'},
      {t:'Nature of EM waves', d:'E⃗ and B⃗ oscillate perpendicular to each other and to the direction of propagation — hence transverse. They are in phase, need no medium, and travel at c in vacuum.'},
      {t:'Spectrum order', d:'Increasing frequency: radio → microwave → infrared → visible → ultraviolet → X-rays → gamma rays. (Decreasing wavelength.)'}
    ],
    formulas:[
      {f:'I_d = ε₀ dφ_E/dt', m:'Displacement current'},
      {f:'c = 1/√(μ₀ε₀) = 3×10⁸ m/s', m:'Speed of EM waves in vacuum'},
      {f:'E₀/B₀ = c', m:'Ratio of field amplitudes'},
      {f:'v = 1/√(με) ; c/v = n', m:'Speed in a medium'}
    ],
    mistakes:['Saying EM waves need a medium.','Reversing the order of the spectrum.','Forgetting that E⃗, B⃗ and the propagation direction form a right-handed set (E⃗ × B⃗ gives the direction of travel).'],
    questions:[
      {marks:2, q:'What is displacement current? Write its expression.', a:'It is the current associated with a changing electric field, I_d = ε₀ dφ_E/dt. Introduced by Maxwell so that Ampere\'s law holds even in the region between the plates of a charging capacitor, where no conduction current flows.'},
      {marks:2, q:'Name the electromagnetic radiation used in (i) sterilising surgical instruments, (ii) radar and satellite communication, (iii) physiotherapy. Give one property of each.', a:'(i) Ultraviolet rays — they kill bacteria because of their high photon energy. (ii) Microwaves — short wavelength allows narrow beams and they pass through the ionosphere. (iii) Infrared rays — they have a strong heating effect and are readily absorbed by tissue.'},
      {marks:2, q:'How do you show that electromagnetic waves are transverse?', a:'They can be polarised. Since only transverse waves can be polarised, and light (an EM wave) shows polarisation through Polaroids, EM waves must be transverse — E⃗ and B⃗ are both perpendicular to the direction of propagation.'}
    ]},

  { id:'p12-6', unit:6, name:'Optics', marks:'18',
    topics:['Reflection at spherical mirrors; mirror formula','Refraction; total internal reflection; optical fibres','Refraction at spherical surfaces; lens maker\'s formula; thin lens formula','Power of a lens; combination of thin lenses in contact','Refraction through a prism; deviation; dispersion','Scattering of light; blue sky, reddish sun at sunrise and sunset','Optical instruments: microscope and telescope, magnifying power','Wave front and Huygens\' principle; laws of reflection and refraction','Interference; Young\'s double slit experiment; fringe width','Diffraction at a single slit; width of central maximum','Polarisation; Brewster\'s law; Malus\' law'],
    concepts:[
      {t:'Total internal reflection', d:'When light travels from denser to rarer medium at an angle greater than the critical angle, it is completely reflected back. Conditions: (i) denser → rarer, (ii) i > i_c. Used in optical fibres, prisms, mirage, sparkle of diamond.'},
      {t:'Huygens\' principle', d:'Every point on a wavefront acts as a source of secondary wavelets spreading out in all directions with the wave speed; the common tangent to these wavelets gives the new wavefront.'},
      {t:'Coherent sources', d:'Sources emitting waves of the same frequency with a constant phase difference. Two independent sources can never be coherent, which is why a single source is split in YDSE.'},
      {t:'Interference vs diffraction', d:'Interference fringes are equally spaced and of equal intensity, arising from two coherent sources. Diffraction gives a bright wide central maximum with rapidly fading, unequally spaced secondary maxima, arising from a single wavefront.'},
      {t:'Polarisation', d:'Restriction of vibrations of the electric vector to one plane. Only transverse waves can be polarised — this proves light is transverse. Achieved by reflection (Brewster angle), refraction, scattering, or Polaroids.'},
      {t:'Blue sky and red sunset', d:'Rayleigh scattering: intensity ∝ 1/λ⁴. Blue is scattered far more than red, so the sky looks blue. At sunrise/sunset light travels a longer path, blue is scattered away and mostly red reaches the eye.'}
    ],
    formulas:[
      {f:'1/v + 1/u = 1/f ; f = R/2 ; m = −v/u', m:'Mirror formula'},
      {f:'n = sin i/sin r = c/v ; n₁ sin i = n₂ sin r', m:'Snell\'s law'},
      {f:'sin i_c = 1/n', m:'Critical angle'},
      {f:'n₂/v − n₁/u = (n₂ − n₁)/R', m:'Refraction at a spherical surface'},
      {f:'1/f = (n − 1)(1/R₁ − 1/R₂)', m:'Lens maker\'s formula'},
      {f:'1/v − 1/u = 1/f ; m = v/u ; P = 1/f (dioptre)', m:'Thin lens'},
      {f:'1/F = 1/f₁ + 1/f₂ … ; P = P₁ + P₂ …', m:'Lenses in contact'},
      {f:'n = sin[(A + D_m)/2] / sin(A/2) ; A + D = i + e', m:'Prism'},
      {f:'m = (1 + D/f) simple ; m = (v₀/u₀)(1 + D/f_e) compound microscope', m:'Microscope'},
      {f:'M = f₀/f_e (normal adjustment) ; M = (f₀/f_e)(1 + f_e/D)', m:'Astronomical telescope'},
      {f:'β = λD/d ; path diff = dsinθ ; bright: nλ, dark: (2n−1)λ/2', m:'Young\'s double slit'},
      {f:'a sinθ = nλ (minima) ; width of central max = 2λD/a', m:'Single slit diffraction'},
      {f:'tan i_p = n (Brewster) ; I = I₀cos²θ (Malus)', m:'Polarisation'}
    ],
    mistakes:['Sign convention errors — distances measured against the incident light are negative.','Using the lens formula 1/v + 1/u = 1/f (that is the mirror formula; for lenses it is 1/v − 1/u = 1/f).','Forgetting that fringe width changes when the apparatus is immersed in a liquid (λ becomes λ/n).','Confusing the width of the central maximum (2λD/a) with the width of a secondary maximum (λD/a).','Writing Malus\' law with amplitude instead of intensity.'],
    questions:[
      {marks:3, q:'Derive the lens maker\'s formula for a thin double convex lens.', a:'Apply refraction at a spherical surface twice. First surface: n₂/v₁ − n₁/u = (n₂ − n₁)/R₁. Second surface (image from first acts as object): n₁/v − n₂/v₁ = (n₁ − n₂)/R₂. Adding: n₁/v − n₁/u = (n₂ − n₁)(1/R₁ − 1/R₂). Dividing by n₁ and putting n = n₂/n₁ and 1/v − 1/u = 1/f gives 1/f = (n − 1)(1/R₁ − 1/R₂).'},
      {marks:5, q:'Describe Young\'s double slit experiment and derive the expression for fringe width.', a:'Light from a monochromatic source passes through a single slit S, then through two narrow slits S₁ and S₂ (separation d) which act as coherent sources. Interference is observed on a screen at distance D. Path difference at a point P at distance y from the centre = yd/D. For a bright fringe, yd/D = nλ so y_n = nλD/d; for a dark fringe y_n = (2n − 1)λD/2d. Fringe width β = y_{n+1} − y_n = λD/d. All bright and dark fringes are equally spaced and of equal intensity. β increases if D increases or d decreases, and decreases (to β/n) if the apparatus is immersed in a liquid of refractive index n.'},
      {marks:3, q:'Draw a ray diagram of a compound microscope in normal adjustment and write the expression for its magnifying power.', a:'Objective (small f₀, small aperture) forms a real, inverted, magnified image just inside the focus of the eyepiece; the eyepiece acts as a simple microscope and forms a virtual, magnified image at the least distance of distinct vision (or at infinity in normal adjustment). Magnifying power m = m₀ × m_e = (v₀/u₀)(1 + D/f_e); with the image at infinity, m = (v₀/u₀)(D/f_e). Length of tube L = v₀ + f_e.'},
      {marks:2, q:'State Brewster\'s law. Show that at the polarising angle the reflected and refracted rays are perpendicular.', a:'Brewster\'s law: tan i_p = n, where i_p is the angle of incidence at which the reflected light is completely plane polarised. By Snell\'s law n = sin i_p/sin r. Equating: tan i_p = sin i_p/sin r, so cos i_p = sin r = cos(90° − i_p), giving r = 90° − i_p. Hence i_p + r = 90°, i.e. the reflected and refracted rays are mutually perpendicular.'},
      {marks:3, q:'Compare interference and diffraction patterns.', a:'Interference: due to superposition of waves from two coherent sources; fringes are of equal width and (nearly) equal intensity; regions of complete darkness exist. Diffraction: due to superposition of secondary wavelets from different parts of the same wavefront; the central maximum is twice as wide as the others and much brighter, with intensity falling rapidly; minima are not completely dark.'},
      {marks:2, q:'Why does a diamond sparkle?', a:'Diamond has a very high refractive index (≈2.42), so its critical angle is small (≈24.4°). Light entering the diamond strikes the faces at angles greater than the critical angle and undergoes repeated total internal reflection before emerging, so it sparkles brilliantly.'}
    ]},

  { id:'p12-7', unit:7, name:'Dual Nature of Radiation and Matter', marks:'7',
    topics:['Photoelectric effect; Hertz and Lenard\'s observations','Einstein\'s photoelectric equation; particle nature of light','Laws of photoelectric emission; effect of intensity, frequency, potential','Matter waves; de Broglie relation','Davisson–Germer experiment (qualitative)'],
    concepts:[
      {t:'Work function', d:'The minimum energy needed to just eject an electron from a metal surface, φ₀ = hν₀. Different for different metals; caesium has a low work function.'},
      {t:'Threshold frequency', d:'Below ν₀ no emission occurs however intense the light — this cannot be explained by wave theory and is strong evidence for the photon picture.'},
      {t:'Stopping potential', d:'The negative anode potential at which the photocurrent becomes zero: eV₀ = KE_max. It depends only on frequency and the metal, not on intensity.'},
      {t:'Effect of intensity', d:'Increasing intensity increases the number of photons per second, so photocurrent increases — but KE_max and stopping potential are unchanged.'},
      {t:'de Broglie hypothesis', d:'Every moving particle has an associated wave of wavelength λ = h/p. Significant only for very light particles like electrons; for macroscopic bodies λ is unmeasurably small.'}
    ],
    formulas:[
      {f:'E = hν = hc/λ', m:'Photon energy; h = 6.63×10⁻³⁴ J s'},
      {f:'hν = φ₀ + KE_max ; KE_max = h(ν − ν₀)', m:'Einstein\'s photoelectric equation'},
      {f:'eV₀ = KE_max = h(ν − ν₀)', m:'Stopping potential'},
      {f:'λ = h/p = h/mv', m:'de Broglie wavelength'},
      {f:'λ = h/√(2mqV) = 12.27/√V Å (electron)', m:'Electron accelerated through V volts'}
    ],
    mistakes:['Thinking a brighter light gives faster photoelectrons.','Using ν₀ where ν is meant in the photoelectric equation.','Forgetting that the photoelectric effect is instantaneous (≈10⁻⁹ s), which wave theory cannot explain.','Not converting eV to joules in numericals.'],
    questions:[
      {marks:3, q:'State three observations of the photoelectric effect that cannot be explained by the wave theory of light.', a:'(i) Existence of a threshold frequency — wave theory predicts emission at any frequency if the light is intense enough. (ii) KE_max depends on frequency, not intensity — wave theory predicts more energetic electrons from more intense light. (iii) Emission is instantaneous — wave theory predicts a measurable time lag while the electron accumulates energy.'},
      {marks:3, q:'Write Einstein\'s photoelectric equation and explain each term. Draw the graph of stopping potential vs frequency.', a:'hν = φ₀ + ½mv²_max. hν is the energy of the incident photon, φ₀ = hν₀ is the work function, and ½mv²_max is the maximum kinetic energy of the emitted electron. Since eV₀ = h(ν − ν₀), the graph of V₀ against ν is a straight line of slope h/e, intercepting the ν-axis at ν₀ and the V₀-axis at −φ₀/e. The slope h/e is the same for all metals; the intercept differs.'},
      {marks:2, q:'Derive the expression for the de Broglie wavelength of an electron accelerated through a potential difference V.', a:'Work done eV = ½mv², so v = √(2eV/m) and p = mv = √(2meV). Hence λ = h/p = h/√(2meV). Substituting values, λ = 12.27/√V Å with V in volts.'},
      {marks:2, q:'How does the photoelectric current vary with the intensity of incident radiation at a fixed frequency above threshold? Explain.', a:'The photocurrent is directly proportional to intensity. Higher intensity means more photons per unit area per second, so more electrons are ejected per second. However, each photon still carries the same energy hν, so KE_max and the stopping potential remain unchanged.'}
    ]},

  { id:'p12-8', unit:8, name:'Atoms and Nuclei', marks:'6',
    topics:['Alpha-particle scattering; Rutherford\'s model','Bohr model; energy levels; hydrogen spectrum','Composition and size of the nucleus; atomic masses; isotopes, isobars, isotones','Mass–energy relation; mass defect; binding energy per nucleon and its variation','Nuclear fission and fusion'],
    concepts:[
      {t:'Rutherford\'s conclusions', d:'Most α-particles pass undeviated (atom is mostly empty), a few deviate largely and about 1 in 8000 rebounds (a small, heavy, positively charged nucleus).'},
      {t:'Limitation of Rutherford\'s model', d:'An accelerating electron should radiate energy continuously and spiral into the nucleus, so the atom would be unstable and give a continuous spectrum — both contradicted by observation.'},
      {t:'Bohr postulates', d:'(i) Electrons revolve only in certain stationary orbits without radiating. (ii) Angular momentum is quantised: mvr = nh/2π. (iii) Radiation is emitted or absorbed only when an electron jumps between orbits: hν = E₂ − E₁.'},
      {t:'Binding energy per nucleon', d:'Peaks at about 8.8 MeV near A = 56 (iron), and is lower for very light and very heavy nuclei. This is why fusion of light nuclei and fission of heavy nuclei both release energy.'},
      {t:'Nuclear force', d:'Strongest known force, charge independent, short range (~few fm), saturates, and is attractive except at very short distances where it becomes repulsive.'}
    ],
    formulas:[
      {f:'r = n²h²ε₀/πme² = 0.53 n²/Z Å', m:'Bohr radius'},
      {f:'E_n = −13.6 Z²/n² eV', m:'Energy of the nth orbit of a hydrogen-like atom'},
      {f:'1/λ = R(1/n₁² − 1/n₂²) ; R = 1.097×10⁷ m⁻¹', m:'Rydberg formula'},
      {f:'mvr = nh/2π', m:'Quantisation of angular momentum'},
      {f:'R = R₀A^{1/3} ; R₀ = 1.2×10⁻¹⁵ m', m:'Nuclear radius'},
      {f:'Δm = [Zm_p + (A−Z)m_n] − M ; BE = Δm·c² ; 1 u = 931.5 MeV', m:'Mass defect and binding energy'}
    ],
    mistakes:['Forgetting the negative sign in E_n.','Mixing up n₁ and n₂ in the Rydberg formula (n₁ is the lower level).','Assuming nuclear density depends on A — it is constant (≈2.3×10¹⁷ kg/m³).','Confusing mass defect (u) with binding energy (MeV) — multiply by 931.5.'],
    questions:[
      {marks:3, q:'Using Bohr\'s postulates, derive the expression for the radius of the nth orbit of a hydrogen atom.', a:'The electrostatic force provides the centripetal force: (1/4πε₀)(e²/r²) = mv²/r, so mv²r = e²/4πε₀. Bohr\'s quantisation gives mvr = nh/2π. Squaring the second and dividing by the first: r = n²h²ε₀/πme². Thus r ∝ n², and for hydrogen r₁ = 0.53 Å.'},
      {marks:3, q:'Draw a graph of binding energy per nucleon against mass number and explain how it accounts for the energy released in fission and fusion.', a:'The curve rises steeply for light nuclei, reaches a maximum of about 8.8 MeV near A = 56, then falls slowly to about 7.6 MeV at A = 238. When a heavy nucleus splits, the fragments lie nearer the peak and have a higher BE/nucleon, so energy is released — fission. When two very light nuclei fuse, the product also has a higher BE/nucleon, so energy is again released — fusion. In both cases the mass defect appears as energy via E = mc².'},
      {marks:2, q:'Show that nuclear density is independent of the mass number.', a:'R = R₀A^{1/3}, so volume V = (4/3)πR³ = (4/3)πR₀³A. Mass ≈ Am_n. Hence density = Am_n / [(4/3)πR₀³A] = 3m_n/(4πR₀³) — independent of A. Its value is about 2.3×10¹⁷ kg m⁻³ for all nuclei.'},
      {marks:2, q:'Why is the sun\'s energy attributed to fusion and not fission?', a:'The sun is composed mainly of hydrogen and helium — light nuclei. Heavy fissionable elements are essentially absent. At the sun\'s extremely high temperature (~10⁷ K) the protons have enough kinetic energy to overcome Coulomb repulsion and fuse into helium, releasing about 26 MeV per helium nucleus formed.'}
    ]},

  { id:'p12-9', unit:9, name:'Electronic Devices', marks:'7',
    topics:['Energy bands in solids; conductors, insulators, semiconductors','Intrinsic and extrinsic semiconductors; p-type and n-type','p-n junction; depletion layer; potential barrier','Semiconductor diode: I–V characteristics in forward and reverse bias','Junction diode as a rectifier: half wave and full wave','Special purpose diodes: Zener diode as voltage regulator, LED, photodiode, solar cell','Junction transistor: characteristics, transistor as an amplifier (CE configuration)','Logic gates: OR, AND, NOT, NAND, NOR'],
    concepts:[
      {t:'Energy band picture', d:'In conductors the valence and conduction bands overlap (E_g = 0). In insulators E_g > 3 eV. In semiconductors E_g is small (Si 1.1 eV, Ge 0.7 eV), so thermal energy can promote electrons.'},
      {t:'Doping', d:'Adding a pentavalent impurity (As, P, Sb) gives an n-type semiconductor with electrons as majority carriers; a trivalent impurity (B, Al, In) gives p-type with holes as majority carriers. Both remain electrically neutral.'},
      {t:'Depletion region', d:'Near the junction, diffusion of majority carriers leaves immobile ions, creating a region free of mobile charge and a potential barrier (≈0.3 V for Ge, 0.7 V for Si). Width decreases in forward bias, increases in reverse bias.'},
      {t:'Zener diode', d:'Heavily doped p-n junction operated in reverse breakdown, where a large change in current produces almost no change in voltage — hence used as a voltage regulator.'},
      {t:'Transistor as amplifier', d:'The emitter-base junction is forward biased (low resistance) and the collector-base junction reverse biased (high resistance). Almost the same current flows through a much higher resistance, so the voltage — and hence power — is amplified.'}
    ],
    formulas:[
      {f:'n_e n_h = n_i²', m:'Mass action law'},
      {f:'r_dc = V/I ; r_ac = ΔV/ΔI', m:'Diode resistance'},
      {f:'Half wave: ripple frequency = f ; Full wave: 2f', m:'Rectifier output'},
      {f:'α = I_C/I_E ; β = I_C/I_B ; β = α/(1−α)', m:'Transistor current gains'},
      {f:'A_V = β × (R_L/R_i)', m:'Voltage gain of a CE amplifier'},
      {f:'I_E = I_B + I_C', m:'Transistor current relation'}
    ],
    mistakes:['Saying doped semiconductors are charged — they are electrically neutral.','Forgetting that in a CE amplifier output is 180° out of phase with input.','Confusing the Zener diode operating region (reverse breakdown) with normal reverse bias.','Mixing up NAND (AND then NOT) with NOR (OR then NOT).'],
    questions:[
      {marks:3, q:'Explain the formation of the depletion layer and potential barrier in a p-n junction.', a:'Because of the concentration gradient, holes diffuse from p to n and electrons from n to p. Near the junction they recombine, leaving behind immobile negative acceptor ions on the p-side and positive donor ions on the n-side. This region, free of mobile carriers, is the depletion layer. The uncovered ions set up an electric field from n to p which opposes further diffusion — the potential barrier (about 0.7 V for silicon).'},
      {marks:5, q:'With a circuit diagram, explain the working of a full wave rectifier. Draw the input and output waveforms.', a:'A centre-tapped transformer feeds two diodes D₁ and D₂ whose outputs are joined across a load R_L. During the positive half cycle the upper half of the secondary makes D₁ forward biased and D₂ reverse biased, so current flows through R_L in one direction. During the negative half cycle D₂ conducts and D₁ is off, but the current through R_L is again in the same direction. Hence both halves of the input are used, and the output is unidirectional pulsating DC with ripple frequency 2f. The input is a full sine wave; the output shows both half cycles above the axis.'},
      {marks:3, q:'Explain how a Zener diode acts as a voltage regulator.', a:'The Zener is connected in reverse bias across the load with a series resistance R_s. It is operated in the breakdown region where the voltage across it stays constant at V_Z over a wide range of current. If the input voltage rises, the extra voltage drops across R_s and the Zener current increases, leaving V_Z — and hence the load voltage — unchanged. If the load current changes, the Zener current adjusts oppositely so that the total current through R_s stays nearly constant. Thus the output remains regulated at V_Z.'},
      {marks:2, q:'Why is a transistor called a current-controlled device? Why is the base thin and lightly doped?', a:'The output collector current is controlled by the small input base current, hence it is current controlled. The base is made thin and lightly doped so that very few of the majority carriers injected from the emitter recombine in it — over 95% pass to the collector, giving a large current gain.'},
      {marks:2, q:'Draw the logic symbol and truth table of a NAND gate and show that it is a universal gate.', a:'A NAND gate gives output 0 only when both inputs are 1 (truth table: 00→1, 01→1, 10→1, 11→0). It is universal because all other gates can be built from it: joining both inputs gives NOT; a NAND followed by a NAND-as-NOT gives AND; inverting both inputs before a NAND gives OR.'}
    ]}
  ]},

  11:{ groups:[], chapters:[
  { id:'p11-1', unit:1, name:'Physical World and Measurement', marks:'—',
    topics:['Scope of physics; fundamental forces in nature','Need for measurement; units; SI system; fundamental and derived units','Dimensions of physical quantities; dimensional analysis and its applications','Significant figures; errors in measurement; accuracy and precision'],
    concepts:[
      {t:'Dimensional analysis uses', d:'Checking correctness of an equation (principle of homogeneity), converting units from one system to another, and deriving relations between quantities.'},
      {t:'Limitations of dimensional analysis', d:'Cannot find dimensionless constants, cannot handle equations with more than three unknowns, and fails for equations involving trigonometric, exponential or logarithmic functions or sums of terms.'},
      {t:'Accuracy vs precision', d:'Accuracy is how close a measurement is to the true value; precision is how finely the measurement is made (resolution/repeatability). A measurement can be precise but inaccurate.'}
    ],
    formulas:[
      {f:'Δa/a × 100', m:'Percentage error'},
      {f:'Z = A^p B^q / C^r ⇒ ΔZ/Z = p(ΔA/A) + q(ΔB/B) + r(ΔC/C)', m:'Combination of errors'},
      {f:'n₁u₁ = n₂u₂', m:'Unit conversion'}
    ],
    mistakes:['Adding errors as they are for multiplication instead of using relative errors.','Retaining more significant figures in the answer than in the least precise input.','Assuming dimensional correctness proves an equation is right.'],
    questions:[
      {marks:2, q:'State the principle of homogeneity and give one application.', a:'Only quantities of the same dimensions can be added, subtracted or equated. Hence every term of a physically correct equation has the same dimensions. Application: checking the correctness of an equation, e.g. v² = u² + 2as has [L²T⁻²] in every term, so it is dimensionally correct.'},
      {marks:3, q:'The period of a simple pendulum depends on its length l, mass m and g. Derive the formula using dimensional analysis.', a:'Let T ∝ l^a m^b g^c. Then [T] = [L]^a [M]^b [LT⁻²]^c. Comparing: M: b = 0; L: a + c = 0; T: −2c = 1 ⇒ c = −½, a = ½. So T = k√(l/g). Dimensional analysis cannot give k, which is found experimentally to be 2π.'}
    ]},
  { id:'p11-2', unit:2, name:'Kinematics', marks:'—',
    topics:['Scalars and vectors; addition and subtraction; unit vector; resolution','Scalar and vector products','Motion in a straight line; position-time, velocity-time graphs','Uniformly accelerated motion; equations of motion','Relative velocity','Projectile motion; uniform circular motion'],
    concepts:[
      {t:'Instantaneous velocity', d:'The limit of average velocity as the time interval tends to zero — the slope of the tangent to the position–time graph.'},
      {t:'Projectile', d:'Horizontal motion is uniform (a_x = 0) and vertical motion is uniformly accelerated (a_y = −g). The two are independent; the path is a parabola.'},
      {t:'Centripetal acceleration', d:'In uniform circular motion the speed is constant but velocity changes direction, giving an acceleration v²/r always directed towards the centre.'}
    ],
    formulas:[
      {f:'v = u + at ; s = ut + ½at² ; v² = u² + 2as', m:'Equations of motion'},
      {f:'s_n = u + (a/2)(2n − 1)', m:'Distance in the nth second'},
      {f:'R = u²sin2θ/g ; H = u²sin²θ/2g ; T = 2u sinθ/g', m:'Projectile from ground'},
      {f:'|A⃗ + B⃗| = √(A² + B² + 2AB cosθ)', m:'Parallelogram law'},
      {f:'a_c = v²/r = ω²r', m:'Centripetal acceleration'}
    ],
    mistakes:['Using scalar addition for velocities at an angle.','Taking g positive for upward motion — fix a sign convention and keep it.','Forgetting that at maximum height the vertical velocity is zero but horizontal velocity is not.'],
    questions:[
      {marks:3, q:'Show that the path of a projectile is a parabola.', a:'Take the point of projection as origin, u at angle θ. Horizontally x = (u cosθ)t so t = x/(u cosθ). Vertically y = (u sinθ)t − ½gt². Substituting: y = x tanθ − gx²/(2u²cos²θ). This is of the form y = ax − bx², the equation of a parabola.'},
      {marks:3, q:'Show that the maximum range of a projectile is obtained at 45° and equals u²/g.', a:'R = u²sin2θ/g. R is maximum when sin2θ = 1, i.e. 2θ = 90°, so θ = 45°. Then R_max = u²/g. Also, the ranges for θ and (90° − θ) are equal.'}
    ]},
  { id:'p11-3', unit:3, name:'Laws of Motion', marks:'—',
    topics:['Newton\'s laws; inertia; momentum; impulse','Law of conservation of linear momentum and its applications','Equilibrium of concurrent forces','Friction: static, kinetic, rolling; laws of friction','Dynamics of uniform circular motion: banking of roads, motion in a vertical circle'],
    concepts:[
      {t:'Newton\'s second law', d:'F⃗ = dp⃗/dt. For constant mass this reduces to F = ma. It gives the quantitative measure of force and defines the newton.'},
      {t:'Impulse–momentum theorem', d:'Impulse J = FΔt = Δp. Explains why a cricketer moves his hands back while catching — increasing Δt reduces F for the same Δp.'},
      {t:'Angle of friction', d:'tanλ = μ, the angle the resultant of the normal reaction and limiting friction makes with the normal. The angle of repose equals the angle of friction.'}
    ],
    formulas:[
      {f:'F = ma = dp/dt ; J = FΔt = Δp', m:'Second law and impulse'},
      {f:'f_s ≤ μ_sN ; f_k = μ_kN', m:'Friction'},
      {f:'tanθ = v²/rg (banking, no friction) ; v_max = √(rg(μ + tanθ)/(1 − μtanθ))', m:'Banked road'},
      {f:'v_top ≥ √(gr) ; v_bottom ≥ √(5gr)', m:'Vertical circle'}
    ],
    mistakes:['Treating friction as always μN — static friction is only ≤ μ_sN.','Adding a "centrifugal force" in an inertial frame.','Forgetting that action and reaction act on different bodies and never cancel.'],
    questions:[
      {marks:3, q:'Derive the expression for the maximum speed of a car on a banked road with friction.', a:'Resolving along the incline and perpendicular to it with friction acting down the slope at maximum speed: N cosθ = mg + f sinθ and N sinθ + f cosθ = mv²/r, with f = μN. Solving gives v_max = √[rg(tanθ + μ)/(1 − μ tanθ)]. Without friction (μ = 0), v = √(rg tanθ).'},
      {marks:3, q:'Prove the law of conservation of linear momentum from Newton\'s laws.', a:'For an isolated system of two bodies, by the third law F₁₂ = −F₂₁. So dp₁/dt = −dp₂/dt, giving d(p₁ + p₂)/dt = 0. Hence p₁ + p₂ = constant — the total linear momentum of an isolated system remains constant.'}
    ]},
  { id:'p11-4', unit:4, name:'Work, Energy and Power', marks:'—',
    topics:['Work done by a constant and a variable force','Kinetic energy; work–energy theorem','Potential energy; conservative and non-conservative forces','Conservation of mechanical energy','Power','Collisions in one and two dimensions; elastic and inelastic'],
    concepts:[
      {t:'Work–energy theorem', d:'The net work done by all forces on a body equals the change in its kinetic energy.'},
      {t:'Conservative force', d:'Work done is independent of the path and zero over a closed loop; a potential energy can be defined (gravity, spring force). Friction is non-conservative.'},
      {t:'Coefficient of restitution', d:'e = (relative velocity of separation)/(relative velocity of approach). e = 1 for perfectly elastic, 0 for perfectly inelastic.'}
    ],
    formulas:[
      {f:'W = F⃗·s⃗ = Fs cosθ ; W = ∫F dx', m:'Work'},
      {f:'KE = ½mv² = p²/2m ; W_net = ΔKE', m:'Kinetic energy'},
      {f:'PE = mgh ; U_spring = ½kx²', m:'Potential energy'},
      {f:'P = W/t = F⃗·v⃗', m:'Power'},
      {f:'Elastic 1-D: v₁ = ((m₁−m₂)u₁ + 2m₂u₂)/(m₁+m₂)', m:'Head-on elastic collision'}
    ],
    mistakes:['Forgetting cosθ — work is zero when force is perpendicular to displacement.','Assuming momentum is not conserved in inelastic collisions (it always is; only KE is not).'],
    questions:[
      {marks:3, q:'Show that in a one-dimensional elastic collision between two equal masses, the velocities are exchanged.', a:'Using v₁ = ((m₁−m₂)u₁ + 2m₂u₂)/(m₁+m₂) with m₁ = m₂ = m, we get v₁ = u₂ and similarly v₂ = u₁. Hence the bodies simply exchange velocities.'},
      {marks:3, q:'State and prove the work–energy theorem for a variable force.', a:'W = ∫F dx = ∫m(dv/dt)dx = ∫mv dv (since dx/dt = v) = ½mv² − ½mu² = ΔKE. Hence the work done by the net force equals the change in kinetic energy.'}
    ]},
  { id:'p11-5', unit:5, name:'Motion of System of Particles and Rigid Body', marks:'—',
    topics:['Centre of mass; motion of the centre of mass','Moment of a force; torque; angular momentum; conservation of angular momentum','Moment of inertia; radius of gyration; theorems of parallel and perpendicular axes','Moments of inertia of simple geometrical objects','Equations of rotational motion; comparison with translational motion'],
    concepts:[
      {t:'Moment of inertia', d:'The rotational analogue of mass. It depends not only on mass but on how that mass is distributed about the axis, so it changes with the choice of axis.'},
      {t:'Conservation of angular momentum', d:'If no external torque acts, L = Iω stays constant. A skater pulling in her arms decreases I and hence spins faster.'},
      {t:'Radius of gyration', d:'K = √(I/M) — the distance from the axis at which the whole mass could be concentrated to give the same moment of inertia.'}
    ],
    formulas:[
      {f:'τ⃗ = r⃗ × F⃗ ; L⃗ = r⃗ × p⃗ = Iω⃗ ; τ = dL/dt', m:'Rotational dynamics'},
      {f:'I = Σmr² ; I = MK²', m:'Moment of inertia'},
      {f:'I = I_cm + Md² (parallel axes) ; I_z = I_x + I_y (perpendicular axes, lamina)', m:'Theorems'},
      {f:'KE_rot = ½Iω² ; Rolling KE = ½mv²(1 + K²/R²)', m:'Rotational kinetic energy'},
      {f:'Disc ½MR², Ring MR², Solid sphere (2/5)MR², Rod ML²/12', m:'Standard moments of inertia'}
    ],
    mistakes:['Applying the perpendicular axis theorem to a 3-D body — it holds only for a plane lamina.','Forgetting rotational KE when a body rolls.'],
    questions:[
      {marks:3, q:'State and prove the theorem of parallel axes.', a:'I = I_cm + Md², where d is the distance between the two parallel axes and I_cm is about the axis through the centre of mass. Proof: I = Σm_i(x_i + d)² = Σm_ix_i² + 2dΣm_ix_i + d²Σm_i. The middle term vanishes because Σm_ix_i = 0 about the centre of mass. Hence I = I_cm + Md².'},
      {marks:2, q:'A ballet dancer spins faster on folding her arms. Explain.', a:'No external torque acts, so angular momentum L = Iω is conserved. Folding the arms brings mass closer to the axis, decreasing I; therefore ω increases so that Iω stays constant.'}
    ]},
  { id:'p11-6', unit:6, name:'Gravitation', marks:'—',
    topics:['Kepler\'s laws of planetary motion','Universal law of gravitation; acceleration due to gravity and its variation','Gravitational potential energy and gravitational potential','Escape velocity; orbital velocity of a satellite','Geostationary satellites'],
    concepts:[
      {t:'Kepler\'s laws', d:'(1) Orbits are ellipses with the sun at a focus. (2) The line joining planet and sun sweeps equal areas in equal times (a consequence of conservation of angular momentum). (3) T² ∝ a³.'},
      {t:'Escape velocity', d:'The minimum speed needed to project a body so that it never returns. Independent of the mass and the direction of projection, and equal to 11.2 km/s for the earth.'},
      {t:'Geostationary satellite', d:'Period 24 h, height ≈36,000 km, equatorial orbit, rotates west to east — so it appears stationary from the earth. Used for communication.'}
    ],
    formulas:[
      {f:'F = Gm₁m₂/r² ; g = GM/R²', m:'Gravitation'},
      {f:'g_h = g(1 − 2h/R) ; g_d = g(1 − d/R)', m:'Variation of g with height and depth'},
      {f:'V = −GM/r ; U = −GMm/r', m:'Gravitational potential and PE'},
      {f:'v_o = √(GM/(R+h)) ; v_e = √(2GM/R) = √(2gR) = 11.2 km/s', m:'Orbital and escape velocity'},
      {f:'v_e = √2 · v_o ; T = 2π√((R+h)³/GM)', m:'Relations'}
    ],
    mistakes:['Using g = GM/R² at height without correction.','Forgetting the negative sign in gravitational potential energy.'],
    questions:[
      {marks:3, q:'Derive the expression for escape velocity from the earth\'s surface.', a:'For escape, the total energy must be at least zero: ½mv_e² + (−GMm/R) = 0. Hence v_e = √(2GM/R). Using GM = gR², v_e = √(2gR) ≈ 11.2 km/s. It is independent of the mass of the body and the direction of projection.'},
      {marks:2, q:'Why does a geostationary satellite appear stationary?', a:'Its period of revolution equals the earth\'s period of rotation (24 h), it revolves in the equatorial plane and in the same sense (west to east). Hence its angular position relative to a point on the earth never changes, and it appears fixed in the sky.'}
    ]},
  { id:'p11-7', unit:7, name:'Properties of Bulk Matter', marks:'—',
    topics:['Elastic behaviour; stress–strain; Hooke\'s law; Young\'s modulus, bulk modulus, modulus of rigidity','Pressure due to a fluid column; Pascal\'s law and applications','Viscosity; Stokes\' law; terminal velocity; streamline and turbulent flow; Reynolds number','Bernoulli\'s theorem and applications','Surface energy and surface tension; angle of contact; capillary rise','Heat transfer: conduction, convection, radiation; Newton\'s law of cooling'],
    concepts:[
      {t:'Elastic limit', d:'The maximum stress up to which a body regains its original shape completely on removal of the deforming force.'},
      {t:'Terminal velocity', d:'The constant velocity attained by a body falling through a viscous fluid when the weight is balanced by upthrust plus viscous drag.'},
      {t:'Bernoulli\'s theorem', d:'For a streamline flow of an ideal fluid, P + ½ρv² + ρgh remains constant — a statement of conservation of energy per unit volume.'},
      {t:'Surface tension', d:'The force per unit length acting on an imaginary line drawn on the liquid surface. Equivalently, surface energy per unit area. Decreases with rise in temperature and with impurities like detergent.'}
    ],
    formulas:[
      {f:'Y = FL/AΔL ; K = −ΔP/(ΔV/V) ; η = F/(A·θ)', m:'Elastic moduli'},
      {f:'U = ½ × stress × strain × volume', m:'Elastic PE'},
      {f:'F = 6πηrv ; v_t = 2r²(ρ − σ)g/9η', m:'Stokes\' law, terminal velocity'},
      {f:'P + ½ρv² + ρgh = constant ; A₁v₁ = A₂v₂', m:'Bernoulli and continuity'},
      {f:'h = 2T cosθ/(rρg)', m:'Capillary rise'},
      {f:'Excess pressure: drop 2T/r, bubble 4T/r', m:'Excess pressure'},
      {f:'dQ/dt = KA(T₁−T₂)/L ; dT/dt ∝ (T − T₀)', m:'Conduction; Newton\'s law of cooling'}
    ],
    mistakes:['Using 2T/r for a soap bubble (it has two surfaces, so 4T/r).','Confusing streamline with turbulent flow criteria — Reynolds number below ~2000 is streamline.'],
    questions:[
      {marks:3, q:'Derive the expression for the rise of a liquid in a capillary tube.', a:'The vertical component of the surface tension force around the circumference supports the weight of the liquid column. Upward force = T cosθ × 2πr. Weight = πr²hρg. Equating: 2πrT cosθ = πr²hρg, so h = 2T cosθ/(rρg). Thus h ∝ 1/r — narrower tubes give greater rise.'},
      {marks:3, q:'State Bernoulli\'s theorem and give two applications.', a:'For steady, non-viscous, incompressible streamline flow, P + ½ρv² + ρgh = constant along a streamline. Applications: (i) lift on an aeroplane wing — the curved upper surface makes air move faster, lowering the pressure above and giving an upward lift; (ii) the action of an atomiser/Bunsen burner, where high-speed air creates low pressure that draws liquid or gas up.'}
    ]},
  { id:'p11-8', unit:8, name:'Heat and Thermodynamics', marks:'—',
    topics:['Thermal equilibrium; zeroth law; concept of temperature','Heat, work and internal energy; first law of thermodynamics','Isothermal and adiabatic processes','Second law of thermodynamics; reversible and irreversible processes','Heat engines; Carnot engine and its efficiency; refrigerator'],
    concepts:[
      {t:'First law', d:'ΔQ = ΔU + ΔW — a statement of conservation of energy including heat. ΔU is a state function; ΔQ and ΔW are path dependent.'},
      {t:'Isothermal vs adiabatic', d:'Isothermal: T constant, ΔU = 0, so ΔQ = ΔW; slow process with conducting walls. Adiabatic: ΔQ = 0, so ΔW = −ΔU; fast process with insulating walls; PV^γ = constant.'},
      {t:'Second law', d:'Kelvin–Planck: no engine can convert all the heat absorbed into work. Clausius: heat cannot flow spontaneously from a colder to a hotter body.'},
      {t:'Carnot engine', d:'An ideal reversible engine working between two temperatures with efficiency η = 1 − T₂/T₁, which is the maximum possible for those temperatures and is independent of the working substance.'}
    ],
    formulas:[
      {f:'ΔQ = ΔU + ΔW ; ΔW = ∫P dV', m:'First law'},
      {f:'Isothermal: W = nRT ln(V₂/V₁)', m:'Isothermal work'},
      {f:'Adiabatic: PV^γ = const ; W = (P₁V₁ − P₂V₂)/(γ − 1)', m:'Adiabatic'},
      {f:'C_p − C_v = R ; γ = C_p/C_v', m:'Mayer\'s relation'},
      {f:'η = 1 − Q₂/Q₁ = 1 − T₂/T₁ ; COP = T₂/(T₁ − T₂)', m:'Efficiency and coefficient of performance'}
    ],
    mistakes:['Using the isothermal work formula for an adiabatic process.','Assuming 100% efficiency is possible if friction is removed — the second law forbids it.'],
    questions:[
      {marks:3, q:'Derive the expression for work done in an isothermal expansion of an ideal gas.', a:'For an isothermal process PV = nRT, so P = nRT/V. W = ∫_{V₁}^{V₂} P dV = nRT ∫ dV/V = nRT ln(V₂/V₁) = 2.303 nRT log(V₂/V₁). Since ΔU = 0 for an isothermal change, all the heat absorbed is converted into work.'},
      {marks:3, q:'State the Carnot theorem and write the efficiency of a Carnot engine. Why can efficiency never be 100%?', a:'No engine working between two given temperatures can be more efficient than a reversible (Carnot) engine, and all reversible engines between the same two temperatures have the same efficiency. η = 1 − T₂/T₁. Efficiency would be 100% only if T₂ = 0 K, which is unattainable, or T₁ = ∞. Hence some heat must always be rejected to the sink — this is the second law.'}
    ]},
  { id:'p11-9', unit:9, name:'Behaviour of Perfect Gases and Kinetic Theory', marks:'—',
    topics:['Equation of state of a perfect gas; work done in compressing a gas','Kinetic theory of gases: assumptions; pressure of an ideal gas','Kinetic interpretation of temperature; rms speed','Degrees of freedom; law of equipartition of energy','Mean free path; Avogadro\'s number'],
    concepts:[
      {t:'Kinetic interpretation of temperature', d:'The average translational kinetic energy of a molecule is (3/2)kT — it depends only on temperature, not on the nature of the gas. Absolute zero is where molecular motion ceases.'},
      {t:'Law of equipartition', d:'Each degree of freedom contributes ½kT per molecule to the average energy. Monatomic gases have 3, diatomic 5 (7 at high temperature including vibration).'}
    ],
    formulas:[
      {f:'PV = nRT = NkT ; k = 1.38×10⁻²³ J/K', m:'Ideal gas equation'},
      {f:'P = (1/3)ρv̄² = (1/3)(mN/V)v̄²', m:'Kinetic theory pressure'},
      {f:'v_rms = √(3RT/M) = √(3kT/m)', m:'RMS speed'},
      {f:'E = (3/2)kT per molecule ; (3/2)RT per mole', m:'Average translational KE'},
      {f:'λ = 1/(√2 πd²n)', m:'Mean free path'}
    ],
    mistakes:['Using M in grams instead of kg per mole in v_rms.','Confusing average speed, rms speed and most probable speed (v_mp < v_avg < v_rms).'],
    questions:[
      {marks:5, q:'Derive the expression P = (1/3)ρv̄² for the pressure exerted by an ideal gas.', a:'Consider N molecules of mass m in a cube of side l. A molecule with x-velocity v_x hits a face, rebounds elastically, and its momentum change is 2mv_x. The time between successive impacts on the same face is 2l/v_x, so the rate of momentum transfer (force) is mv_x²/l. Summing over all molecules, F = (m/l)Σv_x². Pressure P = F/l² = (m/l³)Σv_x². Since motion is random, Σv_x² = Σv_y² = Σv_z² = (1/3)Σv², so P = (1/3)(mN/V)v̄² = (1/3)ρv̄², where v̄² is the mean square speed.'},
      {marks:2, q:'Show that the average kinetic energy of a gas molecule is directly proportional to absolute temperature.', a:'From P = (1/3)(mN/V)v̄², PV = (1/3)Nmv̄² = (2/3)N(½mv̄²). Comparing with PV = NkT gives ½mv̄² = (3/2)kT. Hence the average translational KE ∝ T and is independent of the nature of the gas.'}
    ]},
  { id:'p11-10', unit:10, name:'Oscillations and Waves', marks:'—',
    topics:['Periodic motion; simple harmonic motion and its equation','Phase; oscillations of a spring; restoring force and force constant','Energy in SHM: kinetic and potential','Simple pendulum; expression for time period','Free, forced and damped oscillations; resonance','Wave motion; transverse and longitudinal waves; speed of a wave','Principle of superposition; reflection of waves; standing waves','Beats; Doppler effect'],
    concepts:[
      {t:'SHM', d:'Motion in which the restoring force is directly proportional to the displacement from the mean position and is always directed towards it: F = −kx, so a = −ω²x.'},
      {t:'Resonance', d:'When the frequency of the applied periodic force equals the natural frequency of the body, the amplitude becomes maximum. Examples: a soldier breaking step on a bridge, tuning a radio.'},
      {t:'Standing waves', d:'Produced by superposition of two identical waves travelling in opposite directions. Nodes are points of zero displacement, antinodes of maximum. Energy is not transported.'},
      {t:'Doppler effect', d:'The apparent change in frequency due to relative motion between source and observer. Frequency increases on approach and decreases on recession.'}
    ],
    formulas:[
      {f:'x = A sin(ωt + φ) ; v = ω√(A² − x²) ; a = −ω²x', m:'SHM'},
      {f:'KE = ½mω²(A² − x²) ; PE = ½mω²x² ; E = ½mω²A²', m:'Energy in SHM'},
      {f:'T = 2π√(m/k) (spring) ; T = 2π√(l/g) (pendulum)', m:'Time periods'},
      {f:'v = νλ ; v = √(T/μ) (string) ; v = √(γP/ρ) (gas)', m:'Wave speed'},
      {f:'Beats: n = |ν₁ − ν₂|', m:'Beat frequency'},
      {f:'ν\' = ν(v ± v_o)/(v ∓ v_s)', m:'Doppler effect'}
    ],
    mistakes:['Sign errors in the Doppler formula — remember the apparent frequency rises when they approach.','Confusing amplitude with displacement in energy formulas.','Forgetting that the time period of a simple pendulum is independent of the mass of the bob.'],
    questions:[
      {marks:3, q:'Show that the total energy of a particle in SHM is constant and proportional to the square of the amplitude.', a:'KE = ½mv² = ½mω²(A² − x²) and PE = ½mω²x². Adding, E = ½mω²A², which is independent of x. Hence total energy remains constant during the motion and E ∝ A².'},
      {marks:3, q:'Derive an expression for the apparent frequency when a source approaches a stationary observer.', a:'In one second the source emits ν waves but has moved forward v_s metres, so these ν waves are compressed into a length (v − v_s). The apparent wavelength λ\' = (v − v_s)/ν. Hence the apparent frequency ν\' = v/λ\' = νv/(v − v_s), which is greater than ν. The pitch therefore appears higher as the source approaches.'},
      {marks:2, q:'What are beats? Write the expression for beat frequency and state one application.', a:'When two sound waves of slightly different frequencies superpose, the intensity rises and falls periodically — these waxings and wanings are beats. Beat frequency = |ν₁ − ν₂|. Application: tuning musical instruments — the instrument is adjusted until the beats with a standard fork disappear.'}
    ]}
  ]}
  }
};
