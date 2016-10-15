'use strict';

module.exports = function (Test) {
	
	var _ = require('lodash');
	var q = require('q');
	var watson = require('watson-developer-cloud');
	
	Test.createLikeString = function (likes) {
		var defer = q.defer();
		var interestStr;
		
		if (likes && likes.data.length > 0) {
			_.forEach(likes.data, function (like, index) {
				interestStr = interestStr + '. ' + like.about;
				if (index == likes.data.length - 1) {
					defer.resolve(interestStr);
				}
			});
		} else {
			defer.reject({'err': 'no hay suficientes likes'});
		}
		return defer.promise;
		
	};
	
	Test.personality = function (text) {
		var defer = q.defer();
		var personality_insights = watson.personality_insights({
			username: '30047b2c-eb95-4ee6-a67a-380baedb7e97',
			password: 'eWiFNaqRch1i',
			version: 'v2'
		});
		
		var params = {
			"contentItems": [
				{
					"content": text,
					"contenttype": "text/plain",
					"created": 1447639154000,
					"id": "666073008692314113",
					"language": "en",
					"sourceid": "Twitter API",
					"userid": "@sersaa"
				}
			]
		};
		
		personality_insights.profile(params, function (error, response) {
				if (error) {
					defer.reject({'error': error});
				}
				else {
					defer.resolve(response);
				}
			}
		);
		return defer.promise;
	};
	
	
	Test.alchemy = function (text) {
		
		var defer = q.defer();
		
		var alchemy_language = watson.alchemy_language({
			api_key: '65df28cb4a32a0f809f12e2061a7f31b8fe02c01'
		});
		
		var parameters = {
			maxRetrieve: 20,
			text: text
		};
		
		alchemy_language.concepts(parameters, function (err, response) {
			if (err) {
				console.log('error alc',err);
				console.log(':',text);
				defer.reject(err);
			} else {
				defer.resolve(response);
			}
		});
		return defer.promise;
	};
	
	
	Test.test = function (req, cb) {
		var profileObj = {
			"id": "10152977542499051",
			"interested_in": [
				"female"
			],
			"age_range": {
				"min": 21
			},
			"birthday": "10/05/1989",
			"favorite_teams": [
				{
					"id": "1541034622808466",
					"name": "Top videos surfing"
				},
				{
					"id": "20669912712",
					"name": "Arsenal"
				},
				{
					"id": "136274496410799",
					"name": "Colo-Colo"
				},
				{
					"id": "108741349213484",
					"name": "El Cruce"
				}
			],
			"about": "=p",
			"gender": "male",
			"tagged_places": {
				"data": [
					{
						"place": {
							"id": "1419648524974130",
							"location": {
								"city": "Providencia",
								"country": "Chile",
								"latitude": -33.44212,
								"longitude": -70.62612,
								"street": "Av Italia 810",
								"zip": "7501156"
							},
							"name": "Teatro Italia"
						},
						"id": "10154206794754051"
					},
					{
						"place": {
							"id": "341971612637403",
							"location": {
								"city": "Las Condes",
								"country": "Chile",
								"latitude": -33.4174147,
								"longitude": -70.6002462,
								"street": "Av. El Bosque Norte 40, Las Condes",
								"zip": "7550211"
							},
							"name": "Bar Nacional - Bosque Norte"
						},
						"id": "10154132386469051"
					},
					{
						"place": {
							"id": "1553674698265976",
							"location": {
								"city": "Providencia",
								"country": "Chile",
								"latitude": -33.4242674,
								"longitude": -70.6164367,
								"street": "La Concepcion 81 of 208"
							},
							"name": "Alquimio"
						},
						"id": "10154090563124051"
					},
					{
						"place": {
							"id": "828627003849923",
							"location": {
								"city": "Providencia",
								"country": "Chile",
								"latitude": -33.418683341403,
								"longitude": -70.601148323575,
								"street": "Hernando de Aguirre 47",
								"zip": "0324355"
							},
							"name": "El Kika"
						},
						"id": "10154018245824051"
					},
					{
						"place": {
							"id": "258532967508008",
							"location": {
								"city": "Chiñihue",
								"country": "Chile",
								"latitude": -33.677859908465,
								"longitude": -71.109261670609,
								"street": "Aeródromo Los Cuatro Diablos, Chiñihue, Melipilla"
							},
							"name": "Skydive Andes"
						},
						"id": "10154007891899051"
					},
					{
						"place": {
							"id": "174350542599067",
							"location": {
								"city": "Providencia",
								"country": "Chile",
								"latitude": -33.4225747,
								"longitude": -70.6118631,
								"street": "Las Urbinas 44. Providencia"
							},
							"name": "California Cantina"
						},
						"id": "10154000093339051"
					},
					{
						"place": {
							"id": "34324811338",
							"location": {
								"city": "Sydney",
								"country": "Australia",
								"latitude": 32.770689398033,
								"located_in": "284237051698162",
								"longitude": -96.803943351023,
								"state": "NSW",
								"zip": "2021"
							},
							"name": "KOOZA by Cirque du Soleil"
						},
						"id": "10153943080554051"
					},
					{
						"place": {
							"id": "1553674698265976",
							"location": {
								"city": "Providencia",
								"country": "Chile",
								"latitude": -33.4242674,
								"longitude": -70.6164367,
								"street": "La Concepcion 81 of 208"
							},
							"name": "Alquimio"
						},
						"id": "10153817685759051"
					},
					{
						"place": {
							"id": "1553674698265976",
							"location": {
								"city": "Providencia",
								"country": "Chile",
								"latitude": -33.4242674,
								"longitude": -70.6164367,
								"street": "La Concepcion 81 of 208"
							},
							"name": "Alquimio"
						},
						"id": "10153813684614051"
					},
					{
						"place": {
							"id": "385654158273261",
							"location": {
								"city": "Antofagasta",
								"country": "Chile",
								"latitude": -23.67713217898,
								"longitude": -70.412230480117,
								"street": "Av. Rep. de Croacia 0520",
								"zip": "1240000"
							},
							"name": "Lemon Garden-Bar Antofagasta"
						},
						"id": "10153778714264051"
					}
				],
				"paging": {
					"cursors": {
						"before": "MTAxNTQyMDY3OTQ3NTQwNTEZD",
						"after": "MTAxNTM3Nzg3MTQyNjQwNTEZD"
					},
					"next": "https://graph.facebook.com/v2.8/10152977542499051/tagged_places?access_token=EAACEdEose0cBAHVvoqD8bZAEUX6mVUio3eT5nHtnAcZAT6N38y6ZAFNDkgXbcNiyZCNuzQhenZCwJNQRVy0LcAcUoOA317nzdFovf0ZCZAx2csneWaJpK0TBQomFeZAH0Ezd7IGAV0CPwLmbEOAX8Sm78llOFKhGOiK6pNKEoEmDWgZDZD&pretty=0&fields=place&limit=10&after=MTAxNTM3Nzg3MTQyNjQwNTEZD"
				}
			},
			"favorite_athletes": [
				{
					"id": "1577673789124230",
					"name": "Emma Acuña"
				},
				{
					"id": "211913938907017",
					"name": "Anna Frost"
				},
				{
					"id": "553829737976901",
					"name": "Isidora Jimenez"
				},
				{
					"id": "185352391554471",
					"name": "FERNANDA MACIEL"
				},
				{
					"id": "835580066486393",
					"name": "Matias Anguita 2"
				},
				{
					"id": "1391069154438043",
					"name": "Dupla Rivas-Pazdirek"
				},
				{
					"id": "432056836928864",
					"name": "Fernanda Mackenna"
				},
				{
					"id": "31783895177",
					"name": "Kilian Jornet"
				},
				{
					"id": "311936945587048",
					"name": "Emelie Forsberg"
				},
				{
					"id": "119568683394",
					"name": "CORREMOS.CL"
				}
			],
			"hometown": {
				"id": "108237792531867",
				"name": "Bulnes, Chile"
			},
			"likes": {
				"data": [
					{
						"about": "Luego de cinco exitosas versiones, regresa el Festival de Jazz  ChileEUropa  2015. Por primera vez en Montecarmelo y Patio Bellavista",
						"id": "1435900876629880"
					},
					{
						"about": "Venta juegos de Steam,Origins,Battlenet, Riot Points, Steam Wallet y Juegos de PS3 todo con grandes descuento desde 30% 60% 90% !! Solo visitanos!!",
						"id": "259982827478906"
					},
					{
						"affiliation": "Unión Demócrata Independiente ",
						"about": "Ex Subsecretaria del Servicio Nacional de la Mujer, SERNAM en el Gobierno del Presidente Piñera. Ex Concejal en Lo Prado. Hoy candidata en Vitacura ",
						"id": "389875281079658"
					},
					{
						"about": "SpaceX designs, manufactures and launches the world’s most advanced rockets and spacecraft.",
						"id": "353851465130"
					},
					{
						"id": "193917577364650"
					},
					{
						"about": "WOM te trae a Facebook lo que quieres: Entretención, concursos, tremendas promos y #ActitudWOM. ",
						"id": "1633475046886434"
					},
					{
						"about": "A page for memes relating to Programming and Computer Science",
						"id": "1400656553566969"
					},
					{
						"about": "El Spiderman Providencia que baila en terrazas, semaforos y eventos infantiles.",
						"id": "1214302541929224"
					},
					{
						"about": "Joseph Herscher makes comical chain-reaction machines. His videos have been viewed by over 20 million people online.",
						"id": "127556690755769"
					},
					{
						"about": "Te invitamos a formar parte de la familia cervecera y disfrutar de nuestras especialidades craft elaboradas en Torobayo, con agua blandas valdivianas.",
						"id": "18243256799"
					},
					{
						"about": "Servicios de impresión Offset + Digital Express, Papelería Corporativa, Publicidad y Diseño.",
						"id": "233613710338362"
					},
					{
						"about": "Con BotCenter automatiza las interacciones de tu empresa con tus clientes a través de Internet, reduciendo costos y aumentando ingresos.",
						"id": "523392624519564"
					},
					{
						"about": "¿Te apasiona la programación tanto como a nosotros? ¡Únete y descubre más! ",
						"id": "631166600368378"
					},
					{
						"about": "Toda ayuda es bien recibida para la familia de Bart, chihuahua perdido, café claro patitas blancas, macho pequeño (2,5kg). No nos rendiremos!!",
						"id": "326098777728111"
					},
					{
						"about": "NUEVOS CURSOS DE SALSA, BACHATA Y POLE DANCE.RESPONDEMOS TODAS TUS INQUIETUDES POR WHATSAP FONO/WPP: +56985258411",
						"id": "505372849494501"
					},
					{
						"about": "Este 16 de Otubre, 6 países, decenas de artistas, todos movilizados por un objetivo: Ayudar a reconstruir Ecuador.",
						"id": "1613521385629010"
					},
					{
						"about": "Primer Club de Vinos de Chile nacido en el año 1997.",
						"id": "268052301013"
					},
					{
						"about": "Te invitamos a conocer el  nuevo barco de la flota Barbazul: una nueva experiencia de sabores y sonidos.  ¡#Embárcate y vive la experiencia Barba Negra! ⚓",
						"id": "265884890432378"
					},
					{
						"about": "A la edad de 45 años Henry Sands Brooks abrió H.& D.H. Brooks & Co. en la esquina noreste de las calles Catherine y Cherry en la ciudad de Nueva York.",
						"id": "179289055446019"
					},
					{
						"id": "273168169362020"
					},
					{
						"about": "Página oficial en Facebook de Cedip-HLF, concepto colectivo líder en información, educación e innovaciones en medicina materno-fetal en Chile y Sudamérica",
						"id": "471323526388899"
					},
					{
						"about": "Recorrido gastronómico en búsqueda de lo mejor de nuestra comida callejera y al paso.",
						"id": "225512430979562"
					},
					{
						"about": "Recibimos toda esa ropa que ya no puedes ocupar y que está en tan buen estado, que es una lástima que nadie más la tenga.",
						"id": "531989990320496"
					},
					{
						"about": "Tomanji, el mejor juego para carretear ya está disponible para iPhone, Android y dispositivos de escritorio. Sólo necesitas amigos, alcohol y Tomanji! http://www.tomanji.cl",
						"id": "287456454674913"
					},
					{
						"about": "OpenLab es el Laboratorio de Innovación y Emprendimiento de la Facultad de Ciencias Físicas y Matemáticas de la Universidad de Chile.",
						"id": "1068771979850653"
					},
					{
						"about": "http://www.electroemite.fm Emite Tu Electrónica",
						"id": "76824075638"
					},
					{
						"about": "Comida feliz :)",
						"id": "1389761521241786"
					},
					{
						"about": "En BuscaLibre.com ahorra tiempo y pide lo que quieras a través de Internet. Nosotros lo enviamos a tu casa u oficina ;)",
						"id": "139692006112195"
					},
					{
						"about": "Consultora de innovación tecnológica",
						"id": "1553674698265976"
					}, {
						"about": "C'est si bon The European trendy café Costanera Center, Local 1152.",
						"id": "290103647797969"
					},
					{
						"id": "357871517597846"
					},
					{
						"about": "Lider, Precios Bajos todos los días. Twitter: @LIDERcl Instagram: @LIDER_cl",
						"id": "145799272155112"
					},
					{
						"about": "Bienvenido a la página oficial de Itaú Chile en Facebook. Ahora estamos más cerca de ti ;-) Mesa Central: +56 226860000",
						"id": "390133571146900"
					},
					{
						"about": "La primera empresa de jugos prensados en frío de Chile y Latinoamérica. RAW & COLD-PRESSED",
						"id": "158345677695035"
					},
					{
						"id": "1541034622808466"
					},
					{
						"about": "Somos el principal centro de entretención de la ciudad. Dentro de nuestros panoramas encontrarás Casino, Restaurantes, SPA, Bares y OVO NightClub.",
						"id": "1448393025407979"
					},
					{
						"about": "Tienda de audio de alta fidelidad HiFi. Compra Audifonos, Parlantes, Amplificadores, Tornamesas, DAC, etc. Envios a todo Chile. El mejor precio y garantia.",
						"id": "59129101384"
					},
					{
						"id": "661213150686363"
					},
					{
						"about": "Caga duro, entrena liviano..",
						"id": "1639882479569958"
					},
					{
						"about": "NIKOLAS VILLAGRAN TATUAJES - DIBUJOS - PINTURA TOMÉ, CONCEPCIÓN CONSULTAS Y COTIZACIONES PREGUNTAS POR INBOX ",
						"id": "585606011543861"
					},
					{
						"about": "The Lifestyle Beat has everything you want to know. From fashion to travel to relationships - and more! - we have you covered! ",
						"id": "551423458286483"
					},
					{
						"about": "SI QUIERES EL AUDIO ORIGINAL CON SUBTÍTULOS EN WARNER CHANNEL U OTRO CANAL DE PAGA, DALE LIKE A LA PAGINA Y UTILIZA EL HASHTAG #YANOSOMOSWARNER",
						"id": "496962917155615"
					},
					{
						"about": "Es un procedimiento que se basa  en la hipnosis e incluye en su ejecución terapias auxiliares que permiten que quien tiene una adicción pueda dejarla ",
						"id": "1569799019916803"
					},
					{
						"about": "Bienvenido a la página oficial de LATAM Airlines Chile. Para tus consultas y dudas, te invitamos a seguirnos en Twitter: @LATAM_CHI.",
						"id": "159639460764792"
					},
					{
						"about": "Cultura 360º",
						"id": "1420689188210781"
					},
					{
						"id": "1701488000064629"
					},
					{
						"about": "Te invitamos HOY a ser un pirata, compartir nuestros códigos y disfrutar nuestros tragos. ¡#Embárcate y vive la experiencia Barbazul! ⚓",
						"id": "573726962682212"
					},
					{
						"id": "883556505027439"
					},
					{
						"about": "Creada el año 2009 con el propósito de asesorar, potenciar y dar a conocer instituciones de Chillan. Síguenos: http://www.twitter.com/revista_murano",
						"id": "525326010912416"
					},
					{
						"about": "Discotheque Santiaguina ubicada en el corazón de Las Condes. Grandes fiestas todas las semanas.",
						"id": "641757659185499"
					},
					{
						"about": "Barberia  fundada en 1978  por  Rubén  Mondaca  H,  atendida hoy por sus hijos Diego y Rubén manteniendo la excelencia y tradición familiar ",
						"id": "1410010129303551"
					},
					{
						"about": "Sin Azúcar es un portal informativo sobre alimentos sin azúcar, orientado a niños, mujeres y hombres, tercera edad, embarazadas. ",
						"id": "1523841794575775"
					},
					{
						"about": "LA INFORMACIÓN TECH MÁS OH!ZOM DE LA GALAXIA",
						"id": "1206448386039234"
					},
					{
						"about": "Esta es una pagina para los programadores, Geek's, freaky's Gamer's, y toda persona amante de la informática, Acá encontraras buen humor.",
						"id": "120463681478699"
					},
					{
						"about": "Microsoft Imagine conecta a estudiantes de tecnología de todos los niveles con recursos y experiencias para hacer realidad sus ideas innovadoras.",
						"id": "379254489786"
					},
					{
						"id": "119399985148"
					},
					{
						"about": "BIZARRO (De it. bizzarro, iracundo). 1. adj. valiente (esforzado). 2. adj. Generoso, lucido, espléndido. http://lomejordechilebizarro.blogspot.cl/",
						"id": "276117149103030"
					},
					{
						"about": "Spotify es una nueva forma de escuchar música. Escucha la canción que quieras en el momento que quieras.",
						"id": "1145634868822773"
					},
					{
						"about": "Quinteto de vientos Coda",
						"id": "1631039040498783"
					},
					{
						"about": "Lo mejor de Internet en un sólo lugar",
						"id": "206450269689466"
					},
					{
						"about": "También estamos en www.enjoy.cl y en www.twitter.com/enjoycasinos.",
						"id": "111999615523014"
					},
					{
						"about": "Tienda especializada en ropa, productos y accesorios deportivos, para toda la familia.",
						"id": "963537403705388"
					},
					{
						"id": "192819664393657"
					},
					{
						"about": "Página oficial de Netflix en Facebook para América Latina. Prueba gratis por un mes nuestro servicio de suscripción de series y películas registrándote en www.netflix.com ¿Buscas las últimas novedades de Netflix? Si es así, este es tu sitio.",
						"id": "268372269857888"
					},
					{
						"about": "Ruta Nómade es el canal informativo de la serie de eventos de Trail Running de Andeschimp. Corralco Challenge y Futangue Challenge http://www.rutanomade.cl",
						"id": "1429699467313574"
					},
					{
						"about": "Somos Raza.fm, una radio online que apoya a bandas emergentes. ¿Tienes una Banda? Contáctanos, haremos que tu música se escuche. ¡Al Aire en 2016!",
						"id": "957224111012182"
					},
					{
						"about": "\"Los cambios en los paradigmas tradicionales de la comunicación, abren paso a la democratización de la comunicación\". LaRepública.",
						"id": "1536393629950793"
					},
					{
						"id": "1051866311520808"
					},
					{
						"id": "703362296355355"
					},
					{
						"about": "Creamos.",
						"id": "500916010044192"
					},
					{
						"about": "Información, cobertura y detalles de Ultra Trail Du Mont Blanc para Chile. ",
						"id": "487928968041883"
					},
					{
						"about": "Somos una consultora que busca apoyar a sus clientes en el ámbito digital. Elaboramos estrategias, asesoramos con soluciones optimizadas y capacitamos.",
						"id": "851906368232970"
					},
					{
						"about": "En la montaña, corriendo, caminando o como sea. Soy Profesor de Educación Física, vivo en Neuquén Capital y dirijo un grupo de entrenamiento. Atleta TNF.",
						"id": "110352952426293"
					},
					{
						"id": "286893159420"
					},
					{
						"affiliation": "The North Face, EPIC Bars, SmartWool, VFuel and Ultimate Direction",
						"about": "I live life to the utmost. I love to go for long runs in the Mountains and capture the magnificent creation mother earth has in-trusted to us. I enjoy nature and the connection of everything in it. I enjoy running to live and breath in the present moment",
						"id": "117917784963141"
					},
					{
						"about": "No lo copie, comparta. :) ",
						"id": "1386241131640896"
					},
					{
						"about": "Nutricionista deportiva, Diplomado en Medicina Deportiva UC, Antropometrista ISAK I. Amante del deporte, fitness y vida sana Horas a Fran@franutrisport.cl",
						"id": "1611644549099793"
					},
					{
						"about": "Eventos deportivos",
						"id": "1584307451834983"
					},
					{
						"about": "En apoyo, admiración y difusión del Deporte Paralimpico Chileno y sus representantes",
						"id": "495475820618100"
					},
					{
						"about": "POR FAVOR, BEBER CON RESPONSABILIDAD bit.ly/PostGuide_ES JACK DANIEL'S and OLD NO. 7 are registered trademarks. ©2016 Jack Daniel's. ",
						"id": "139907679404836"
					},
					{
						"about": "Compromiso, Innovación y Calidad... son los pilares principales de un equipo humano sólido y convencido de entregar soluciones tecnológicas.",
						"id": "997936496907036"
					},
					
					
					{
						"about": "Empresa Chilena, especialista en Emergencias del Hogar y #DetectoresdeHumo. ",
						"id": "735494293262895"
					},
					{
						"about": "Entrenamiento en tú casa, en tú plaza, en tú barrio o donde quieras, en grupo o personalizados a cargo de buenos Profesionales. #NoPainNoBanana",
						"id": "693668607384471"
					},
					{
						"about": "Página Oficial de la primera aplicación mobile dedicada al movimiento cuequero. Sigue a tus artistas favoritos y baila la chilena todo el año.",
						"id": "627497410675128"
					}
				]
			}
		};
		// ANALIZANDO
		// Test.createLikeString(profileObj.likes).then(function (likesString) {
		// 	console.log('resolvio string');
		// 	// Q.all([Test.personality(likesString), Test.alchemy(likesString)]).then(function(response){
		// 	// 	cb(null, {personality : response[0], alchemy : response[1]});
		// 	// });
		// 	//
		// 	// Test.personality(likesString).then(function(response){
		// 	// 	cb(null, response);
		// 	// }, function(err){
		// 	// 	cb(err);
		// 	// });
		// 	//
		// 	Test.alchemy(likesString).then(function (response) {
		// 		cb(null, response);
		// 	}, function (err) {
		// 		cb(err);
		// 	});
		//
		//
		// }, function (err) {
		// 	cb(err);
		// });
		
		
		//SALVANDO LUGARES
		Test.savePlaces(profileObj.tagged_places.data).then(function (places) {
			console.log('resolvio save places');
			// console.log(res);
			var promises = Test.createPromisesPlacesData(places);
			q.all(promises).then(function (userPlaces) {
				console.log('terminaron todas');
				var descriptionText = ' ';
				var categoriesString = ' ';
				_.forEach(userPlaces, function (place, index) {
					descriptionText = descriptionText + place.description;
					categoriesString = categoriesString != ' ' ? (categoriesString + ' , ' + place.categoriesString) : place.categoriesString;
					
					if (index == userPlaces.length - 1) {
						// console.log(categoriesString);
						// console.log('descText',descriptionText);
						Test.alchemy(categoriesString).then(function (res) {
							cb(null, res);
						})
					}
				})
				
				
			});
			// cb(null, res);
		}, function (err) {
			cb(err);
		})
	};
	
	
	Test.savePlaces = function (tagged_places) {
		var defer = q.defer();
		var Place = app.models.place;
		var placesArray = [];
		
		
		_.forEach(tagged_places, function (data, index) {
			var place = data.place;
			place.fbId = place.id;
			delete place.id;
			
			Place.findOne({where: {fbId: place.fbId}}, function (err, placeFound) {
				
				if (!err && (placeFound != null)) {
					// console.log('lugar existe');
					placesArray.push(placeFound);
					
					if (index == tagged_places.length - 1) {
						defer.resolve(placesArray);
					}
					
				} else {
					console.log('lugar no existe', place.name);
					var newLocation = {
						lat: place.location.latitude,
						lng: place.location.longitude
					};
					place.location = newLocation;
					Place.create(place, function (err, placeCreated) {
						// console.log('creo lugar', placeCreated);
						if (err) {
							console.log(err);
							if (index == tagged_places.length - 1) {
								defer.resolve(placesArray);
							}
						} else {
							placesArray.push(placeCreated);
							if (index == tagged_places.length - 1) {
								defer.resolve(placesArray);
							}
						}
					});
				}
			});
		});
		
		return defer.promise;
	};
	
	Test.createPromisesPlacesData = function (places) {
		var arrayPromises = [];
		_.forEach(places, function (place, index) {
			arrayPromises.push(Test.getPlace(place));
		});
		return arrayPromises;
	};
	
	
	Test.getPlace = function (place) {
		var FB = require('facebook-node');
		FB.setAccessToken('949335795196098|vtc4SfWmrpTuC2Ve9hVOcNc85P0');
		
		var defer = q.defer();
		if (place.profiled) {
			defer.resolve(place);
			return defer.promise;
		}
		
		FB.api(place.fbId, {fields: ['place_type', 'name', 'place_topics.limit(10)', 'category', 'category_list', 'description'], locale: 'es_CL'}, function (res) {
				console.log('res api', res);
				if (!res || res.error) {
					console.log('error obteniendo info lugar', res.error);
					defer.reject(res.error);
				} else {
					
					place.mainCategory = res.category.replace('/',' ');
					var categoryList = [];
					var categoriesString = res.description ? res.description + ' ' + res.category.replace('/',' ') : res.category.replace('/',' ');
					_.forEach(res.category_list, function (category, index) {
						categoriesString = categoriesString + ', ' + category.name.replace('/',' ');
						categoryList.push(category.name);
					});
					place.categoriesString = categoriesString;
					console.log('cat string ' ,categoriesString);
					place.description = (res.description ? res.description : '');
					place.categories = categoryList;
					place.profiled = true;
					console.log('place updated', place);
					// SE OBTIENE PERSONALIDAD DEL LUGAR
					Test.alchemy(categoriesString).then(function (response) {
							place.concepts = response.concepts;
							Test.checkConcepts(place.concepts).then(function (res) {
								place.save(function (err, obj) {
									defer.resolve(obj);
								});
							}, function (err) {
								place.save(function (err, obj) {
									defer.resolve(obj);
								});
							});
						}, function (err) {
							place.save(function (err, obj) {
								defer.resolve(obj);
							});
						}
					);
				}
			}
		)
		;
		
		
		return defer.promise;
	}
	;
	
	
	Test.checkConcepts = function (conceptsArray) {
		var Category = app.models.Category;
		var defer = q.defer();
		
		if (conceptsArray.length == 0) {
			defer.resolve();
			return defer.promise;
		} else {
			_.forEach(conceptsArray, function (concept, index) {
				
				Category.findOrCreate({where: {name: concept.text}}, {name: concept.text, type : [' ']}, function (err, categoryFoC) {
					if (err) {
						console.log('error creando concept', err);
					}
					if (index == (conceptsArray.length - 1)) {
						console.log('termino de revisar conceptos');
						defer.resolve('termino concepts');
					}
				});
			});
		}
		
		
		return defer.promise;
	};
	
	Test.remoteMethod(
		'test',
		{
			accepts: [
				{arg: 'req', type: 'object', http: {source: 'req'}}
			
			],
			http: {path: '/test', verb: 'post'},
			returns: {arg: 'response', type: 'object'}
		}
	);
}
;
