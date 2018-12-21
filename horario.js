
var celdaSelec="";

 var trabajosM = [];  // array de tareas: Id de celda, tarea
 

function TratarCasilla(idCelda, textoMateria, diaTarea){
	
	  // si ya ha pasado la hora no se deja introducir tareas
	if ( (document.getElementById(idCelda).style.textDecoration) == "line-through") {
		return 0;
	}
	// si había un día seleccionado se quita la marca en ese día.
	if (celdaSelec != "") {
		document.getElementById(celdaSelec).style.borderWidth="thin";
	}
	// Se rellenan los datos de día y materia en el formulario a partir de los datos de la celda pulsada
	document.getElementById("Materia").value = textoMateria;
	document.getElementById("DiaTarea").value = diaTarea;
	celdaSelec = idCelda;  // Se guarda el id de la celda seleccionada
	var posicion =0;
	var encontrado=false;
	// Se busca si había una tarea para ese día
	for ( var i =0; i<trabajosM.length; i=i+2) {
		if (trabajosM[i] == idCelda) {
			// Si había una tarea se rellena el formulario con dicha tarea
			document.getElementById("Tarea").value= trabajosM[i+1];
			encontrado = true;
		}
	}
	// Si no había tarea para ese día se borra lo que hubiese en el formulario
	if (encontrado == false) {
		document.getElementById("Tarea").value="";
	}
	// Se marca la celda como seleccionada
	document.getElementById(idCelda).style.borderWidth="thick";
}

function CambiarEstadoMateria(){
	// Se obtiene el estado del botón de materia: pulsado o no pulsado
  estadoBoton = document.activeElement.value;
  // La materia va en el nombre del botón. Se obtienen todas las horas de esa materia (que llevan ese nombre de clase)
  materia = document.activeElement.name;	
  var materias = document.getElementsByClassName(materia);
  num_mat = materias.length;
  // Si el botón esta apagado hay que activarlo y se marca en el formulario
  if(estadoBoton == "Off"){
    document.activeElement.value="On";
	document.activeElement.style.fontStyle="italic";
	document.activeElement.style.fontWeight="bold";
	//  Se marcan en el formulario todas las asignaturas encontradas
	for(var i=0; i< num_mat; i++){
		// Si la hora de la asignatura ya ha pasado no se cambia el color del texto.
		if ( (materias[i].style.textDecoration) != "line-through") {  
			materias[i].style.color= "yellow";
		}
		materias[i].style.fontStyle= "italic";
		materias[i].style.borderRadius= "25px";
	}
  }else{
	  document.activeElement.value="Off";
	  document.activeElement.style.fontWeight="normal";
      document.activeElement.style.fontStyle="normal";
	  for(var i=0; i< num_mat; i++){
		  // Si la hora de la asignatura ya ha pasado no se quita el color del texto.
		if ( (materias[i].style.textDecoration) != "line-through") {  
			materias[i].style.color= "black";
		}
		materias[i].style.fontStyle= "normal";
		materias[i].style.borderRadius= "0px";
	 }
  } 
}

function ActualizarTarea(){
	// Si no hay una celda seleccionada no se hace nada
	tarea = document.getElementById("Tarea").value;
	if (celdaSelec == "") {
		return 0;
	}

	var celda = document.getElementById(celdaSelec);
	var posicion=0;
	var existe=false;  // se emplea porque posición puede valer cero cuando es el primer elemento.
	// Se busca si ya existía una tarea definida para esa celda. Se compara el identificativo de la celda		
	for (var i =0; i<trabajosM.length; i=i+2) {
		if (trabajosM[i] === celdaSelec) {
			posicion =i;
			existe = true;
		}
	}
	// Si no existe se añade la tarea: id de la celda y tarea.
	if (existe == false) {
		if (tarea != "") {
			trabajosM.push(celdaSelec);
			trabajosM.push(tarea); 
			// Se pone una figura en la celda para indicar que tiene tarea por hacer
			celda.style.backgroundImage="url(./trabajo.jpg)";
		}
	}
	else {
		// Si existía la tarea
		if (tarea == "") {
			// Si se ha borrado la tarea se quita el icono y se eliminan los campos de la lista
			celda.style.backgroundImage="";
			trabajosM-splice(posicion,2);
		}	
		else {
			// Si no se ha borrado el texto se actualiza la tarea con la nueva. 
			trabajosM[posicion+1]=tarea;
		}
	}
	// Se limpian los campos del formulario
	document.getElementById("Materia").value = "";
	document.getElementById("DiaTarea").value = ""; 
	document.getElementById("Tarea").value = "";
	// Se desmarca la celda que estaba seleccionada
	if (celdaSelec != "") {
		document.getElementById(celdaSelec).style.borderWidth="thin";
	}
	celdaSelec = "";
	
}

function CalcularNotaMedia(){
	var notaMedia = 0;
	// Se suman las notas convirtiendo los textos del formulario en números
	var notas = parseFloat(document.getElementById("NotaL").value) +
				parseFloat(document.getElementById("NotaD").value) +
				parseFloat(document.getElementById("NotaH").value) +
				parseFloat(document.getElementById("NotaTIC").value) +
				parseFloat(document.getElementById("NotaF").value) +
				parseFloat(document.getElementById("NotaM").value) +
				parseFloat(document.getElementById("NotaI").value) +
				parseFloat(document.getElementById("NotaT").value);
	// Se divide por el número de asignaturas 
	notaMedia = notas / 8;
	var casilla = document.getElementById("ResultadoNM");
	// Si la nota es <5 se pone en rojo y si no en verde
	if (notaMedia < 5) {
		casilla.style.color="red";
	} else {
		casilla.style.color="green";
	}
	// se actualiza el formulario
	casilla.value=notaMedia;
}

function ActualizarHoy(){
	// Se leen los datos del día de la semana y la hora del día del formulario
	var diaSel = document.getElementById("comboDia").selectedIndex;
	var HoraSel = document.getElementById("comboHora").selectedIndex;
	// Se recorren los dias y las horas para marcar todas las que han pasado
	for (var i=0; i<5; i++) {
		for (var j=0; j<6; j++) {
			var columna = i + 1;
			var fila= j + 1;
			// el id de la celda se compone con el día y la franja de hora de clase
			var indiceCelda = "Celda" + columna + fila;
			var celda = document.getElementById(indiceCelda);
			if ( (i < diaSel) || (i == diaSel) && (j < HoraSel) ){
				// Si la hora se ha pasado se pone el texto en gris, se tacha y se pone un fondo negro
				celda.style.color="grey";
				celda.style.textDecoration="line-through";
				celda.style.backgroundImage="url(./Negro.jpg)";
				//  Se borran las tareas que hubiese
				for (var k=0; k< trabajosM.length; k=k+2) {
					if (trabajosM[k] === indiceCelda) {
						trabajosM.splice(k,2);
					}
				}
			}
			else {
				// Si la hora no ha pasado se quitan las marcas (por si se ha retrocedido en el tiempo ¿?)
				celda.style.color="black";
				celda.style.textDecoration="none";
			}  
		}
	}
	// Se borra lo que hubiese en el formulario de tareas y se desmarca la celda seleccionada si la hubiese
	document.getElementById("Materia").value = "";
	document.getElementById("DiaTarea").value = ""; 
	document.getElementById("Tarea").value = "";
	if (celdaSelec != "") {
		document.getElementById(celdaSelec).style.borderWidth="thin";
	}
	celdaSelec = "";
}

function foto_de_estacion(diaSelec) {
	var estacion ="";
	// Se recibe el día del calendario. crea la fecha del 1 de enero de ese año.
	var ahora = new Date();
	var comienzo = new Date(diaSelec.getFullYear(), 0, 0);
	// se obtiene la diferencia de días entre el día pasado y el 1 de enero
	var dif = diaSelec - comienzo;
	var unDia = 1000 * 60 * 60 * 24;
	// Se obtiene el número del día del año
	var dia = Math.ceil(dif / unDia);
    // Si la fecha actual es anterior al 21 de marzo
    if ( dia < 79 ) {
       estacion = 'invierno';
//		document.body.style.backgroundImage="url(./invierno.jpg)";
		document.getElementById("titHorario").style.backgroundImage="url(./invierno.jpg)"
    // Si la fecha actual es anterior al 22 de junio
    } else if ( dia < 172 ) {
        estacion = 'primavera';
		document.getElementById("titHorario").style.backgroundImage="url(./primavera.jpg)";
//		document.body.style.backgroundImage="url(./primavera.jpg)";
    // Si la fecha actual es anterior al 23 de septiembre
     } else if ( dia < 265 ) {
        estacion = 'verano';
		document.getElementById("titHorario").style.backgroundImage="url(./verano.jpg)";
 
    // Si la fecha actual es anterior al 19 de diciembre
    } else if ( dia < 352 ) {
        estacion = 'otono';
		document.getElementById("titHorario").style.backgroundImage="url(./otoño.jpg)";
 
    // Si no es ninguna de las anteriores
    } else {
        estacion = 'invierno';
		document.getElementById("titHorario").style.backgroundImage="url(./invierno.jpg)";
//		document.getElementById("DivNotaMedia").style.backgroundImage="url(./invierno.jpg)";
//		document.body.style.backgroundImage="url(./invierno.jpg)";
    }
	
}

function tratarCalendario(){
	// A partir del dato del formulario se obtiene una fecha
	var nuevaFecha = new Date(document.activeElement.value);
	// Se cambia la foto de la estación del año
	foto_de_estacion (nuevaFecha);
}

