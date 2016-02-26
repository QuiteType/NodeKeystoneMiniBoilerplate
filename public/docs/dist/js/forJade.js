function slugify(text){
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')         
    .replace(/[^\w\-]+/g, '')     
    .replace(/\-\-+/g, '-')       
    .replace(/^-+/, '')           
    .replace(/-+$/, '');          
}

function compareDates(date1, date2) {
	return new Date(date1).getDate() > new Date(date2).getDate();
}

function today(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd='0'+dd;
	} 

	if(mm<10) {
	    mm='0'+mm;
	} 

	today = mm+'/'+dd+'/'+yyyy;
	return today;
}