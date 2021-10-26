$(document).ready( function () {

	
	/***************/
	/***PERSONNEL***/
	/***************/
	
	
	//Populate, edit and delete personnel table
	
	$.ajax({
		url: "php/getAll.php",
		type: 'POST',
		dataType: "json",
		success: function(result) {

			//console.log(result);

			if (result.status.name == "ok") {

				var all = result['data'];
				
				//console.log(all);
				
				$(function() {
					
					$.when($.each(all, function(i, personnel) {
						let $tr = $('<tr data-id=' + personnel.id +'>').append(
							$('<td class="personnelLastName">').text(personnel.lastName),
							$('<td class="personnelFirstName">').text(personnel.firstName),
							$('<td class="personnelDepartment" data-department-id="' + personnel.departmentID + '">').text(personnel.department),
							$('<td class="personnelLocation">').text(personnel.location),
							
							$('<td>').html(
								'<button class="info-btn btn text-primary" title="view"><i class="fas fa-info"></i></button>' + 
								'<button class="editEmployee-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
								'<button class="deletePersonnel-btn btn text-danger" title="delete""><i class="fas fa-trash-alt"></i></button>'
							),
							$('<span style="display:none" class="personnelEmail">').text(personnel.email)
						).appendTo('#personnelTable tbody');
						
					})).then(function() {
							
						$.when( 
							
							registerEditDeleteEmployeeButtons()
						
						).then(function() {
						
							$("#personnelTable").DataTable({
								responsive: true,  //buttons are not working in phone format, and some of the windows cannot be seen because of lack of space. Also, look for  modals for confirm/ reject and alert
								scrollY: 400,
								initComplete: function () {
									this.api().columns().every( function () {
										var column = this;

										var some = column.index();
										if (column.index() == 4) return;

										var select = $('<select><option value=""></option></select>')
											.appendTo( $(column.footer()).empty() )
											.on( 'change', function () {
												var val = $.fn.dataTable.util.escapeRegex(
													$(this).val()
												);

												column
													.search( val ? '^'+val+'$' : '', true, false )
													.draw();
											} );

										column.data().unique().sort().each( function ( d, j ) {
											select.append( '<option value="'+d+'">'+d+'</option>' )
										} );
									} );
								}


							});
							
						});
						
					});
					
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		}
		
	});

	//add button

	$("#addEmployee-btn").click(function() {

		$("#addEmployeeModal").modal("show");
		

	});

	$("#addEmployee-submit-btn").click(function() {

		if (($("#addEmployeeFirstName").val() == "" ) || ($("#addEmployeeLastName").val() == "" ) || ($("#addEmployeeEmail").val() == "" )) {
		
			alert( "Please enter all the required fields");
			
			return false;

			// not sure if job title is important so for the moment I get rid of this ($("#addEmployeeJobTitle").val() == "" )||

		}
		
		var getDepartmentName = $("#addEmployeeDepartment option:selected").text()
		
		//use a regular expression to obtain the string in brackets
		var searchDepartmentName = getDepartmentName.match(/\((.*?)\)/);

		var $locationName;
		
		if (searchDepartmentName) {
			
			$locationName = searchDepartmentName[1];
			
		}
		
		//use split to get the first word before the first open bracket
		var $departmentName = getDepartmentName.split("(")[0]
				
		$.ajax({
			url: "php/insertEmployee.php",
			type: 'POST',
			data: {
				firstname: $("#addEmployeeFirstName").val(),
				lastname: $("#addEmployeeLastName").val(),
				jobTitle: $("#addEmployeeJobTitle").val(),
				email: $("#addEmployeeEmail").val(),
				departmentID: $("#addEmployeeDepartment").val(),
				departmentName: $departmentName,
				//locationID: $("#addEmployeeLocation").val(),
				locationName: $locationName,
				//double-check if all of these are necessary or should be changed
			},
			dataType: "json",
			success: function(result) {

				$("#addEmployeeModal").modal("hide");

				console.log(result);

				var newEmployee = result['data'];

				let $tr = $('<tr data-id="' + newEmployee.id + '">').append(

					$('<td class="personnelLastName">').text(newEmployee.lastName),
					$('<td class="personnelFirstName">').text(newEmployee.firstName),
					$('<td class="personnelDepartment" data-department-id="' + $("#addEmployeeDepartment").val() + '">').text(newEmployee.departmentName),
					$('<td class="personnelLocation">').text(newEmployee.locationName),
					$('<td>').html(
						'<button class="info-btn btn text-primary" title="view"><i class="fas fa-info"></i></button>' + 
						'<button class="editEmployee-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
						'<button class="deletePersonnel-btn btn text-danger" title="delete"><i class="fas fa-trash-alt"></i></button>'
					),
					$('<span style="display:none" class="personnelEmail">').text(newEmployee.email)

				).appendTo('#personnelTable');
				
				$("#addEmployeeFirstName").val("");
				$("#addEmployeeLastName").val("");
				$("#addEmployeeJobTitle").val("");
				$("#addEmployeeEmail").val("");
				$("#addEmployeeDepartment").val(0);

				registerEditDeleteEmployeeButtons();


			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
				
			}

		});
	});

	
	//Edit personnel

	var $currentPersonnelRow;

	$("#editEmployee-submit-btn").click(function() {

		if (($("#editEmployeeFirstName").val() == "" ) || ($("#editEmployeeLastName").val() == "" ) || ($("#editEmployeeEmail").val() == "" )) {
		
			alert( "Please enter all the required fields");
			
			return false;

			// not sure if job title is important so for the moment I get rid of this ($("#editEmployeeJobTitle").val() == "" )||

		}
		
		var getDepartmentName = $("#editEmployeeDepartment option:selected").text()
		
		//use a regular expression to obtain the string in brackets
		var searchDepartmentName = getDepartmentName.match(/\((.*?)\)/);

		var $locationName;
		
		if (searchDepartmentName) {
			
			$locationName = searchDepartmentName[1];
			
		}
		
		//use split to get the first word before the first open bracket
		var $departmentName = getDepartmentName.split("(")[0]

		$.ajax({
			url: "php/editPersonnel.php",
			type: 'POST',
			data: {
				firstname: $("#editEmployeeFirstName").val(),
				lastname: $("#editEmployeeLastName").val(),
				jobTitle: $("#editEmployeeJobTitle").val(),
				email: $("#editEmployeeEmail").val(),
				departmentID: $("#editEmployeeDepartment").val(),
				departmentName: $departmentName,
				//locationID: $("#editEmployeeLocation").val(),
				locationName: $locationName,
				id: $currentPersonnelRow.data("id"),
				//double-check if all of these are necessary or should be changed
			},
			dataType: "json",
			success: function(result) {

				$("#editEmployeeModal").modal("hide");

				$("#editEmployeeFirstName").val("");
				$("#editEmployeeLastName").val("");
				$("#editEmployeeJobTitle").val("");
				$("#editEmployeeEmail").val("");
				$("#addEmployeeDepartment").val(0);

				console.log(result);

				var editEmployee = result['data'];
				
				$currentPersonnelRow.find("td.personnelLastName").html(editEmployee.lastName);
				$currentPersonnelRow.find("td.personnelFirstName").html(editEmployee.firstName); 
				$currentPersonnelRow.find("span.personnelEmail").html(editEmployee.email); 
				//add the update of the jobtitle in info	
				
				$currentPersonnelRow.find("td.personnelDepartment").html(editEmployee.departmentName);  
				$currentPersonnelRow.find("td.personnelLocation").html(editEmployee.locationName);  

			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
				
			}

		});


	});
	
	
	function registerEditDeleteEmployeeButtons() {

		$(".info-btn").unbind("click");		
		
		$(".editEmployee-btn").unbind("click");
		
		$(".deletePersonnel-btn").unbind("click");

		//Edit personnel
		
		$(".info-btn").click(function() {
			
			$currentPersonnelRow = $(this).closest('tr');
										
			$('#employeeName').html( $currentPersonnelRow.find('.personnelFirstName').text() + " " + $currentPersonnelRow.find('.personnelLastName').text() );
			$('#employeeEmail').html( $currentPersonnelRow.find('.personnelEmail').text() );
			$('#employeeDepartment').html( $currentPersonnelRow.find('.personnelDepartment').text() );
			$('#employeeLocation').html( $currentPersonnelRow.find('.personnelLocation').text() );

			$("#employeeModal").modal("show");

		});

		$(".editEmployee-btn").click(function() {
			
			$currentPersonnelRow = $(this).closest('tr');
			
			$("#editEmployeeModal").modal("show");
			//You left it here
			
			//alert($currentPersonnelRow.html());
			
			$('#editEmployeeLastName').val( $currentPersonnelRow.find('.personnelLastName').text() );
			$('#editEmployeeFirstName').val( $currentPersonnelRow.find('.personnelFirstName').text() );
			$('#editEmployeeEmail').val( $currentPersonnelRow.find('.personnelEmail').text() );
			$('#editEmployeeDepartment').val( $currentPersonnelRow.find('.personnelDepartment').data("department-id"));
			
			//$('#editEmployeeFirstName').val( $(this).closest('tr').find('.personnelDepartment"').text() );
			//$('#editEmployeeFirstName').val( $(this).closest('tr').find('.personnelLocation"').text() );
			
			//$('#editDepartmentLocation').val( $('#editDepartmentLocation option:contains(' + $(this).closest('tr').find('.location-name').text() + ')').val() );
			
		});


		$(".deletePersonnel-btn").click(function() {

			$currentPersonnelRow = $(this).closest('tr');
	
			let p = confirm( "Are you sure you would like to delete this personnel?" );
			
			if (p == true) {
				
				$.ajax({
					url: "php/deletePersonnelByID.php",
					type: 'POST',
					data: {
						id: $currentPersonnelRow.data("id"),
					},
					dataType: "json",
					success: function(result) {
	
						//console.log(result);
	
						if (result.status.name == "ok") {
	
							//alert("Deleted");
							
							$currentPersonnelRow.remove();
	
						}
	
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log(jqXHR);
						
					}
	
				});
				
			}
			
		});


	}


					
	
	
	/***************/
	/**DEPARTMENTS**/
	/***************/
	
	
	//Populate, edit and delete department table

	$.ajax({
		url: "php/getAllDepartments.php",
		type: 'POST',
		dataType: "json",
		success: function(result) {

			//console.log(result);

			if (result.status.name == "ok") {

				var departments = result['data'];

				$(function() {
					
					$.when($.each(departments, function(i, department) {

						let $tr = $('<tr data-id="' + department.id + '">').append(
							$('<td class="department-name">').text(department.name),
							$('<td class="location-name">').text(department.location),
							$('<td>').html(
								'<button class="editDepartment-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
								'<button class="deleteDepartment-btn btn text-danger" title="delete"><i class="fas fa-trash-alt"></i></button>'
							)
						).appendTo('#departmentsTable tbody');
						
						//populate dropdown menu in add and edit modals
						
						$('#addEmployeeDepartment').append('<option value="' + department.id + '">' + department.name + ' (' + department.location + ')</option>');
						$('#editEmployeeDepartment').append('<option value="' + department.id + '">' + department.name + ' (' + department.location + ')</option>');

					})).then( function() {
						
						$("#departmentsTable").DataTable({
							responsive: true,
							scrollY: 400,
							initComplete: function () {
								this.api().columns().every( function () {
									var column = this;

									var some = column.index();
									if (column.index() == 2) return;

									var select = $('<select><option value=""></option></select>')
										.appendTo( $(column.footer()).empty() )
										.on( 'change', function () {
											var val = $.fn.dataTable.util.escapeRegex(
												$(this).val()
											);
					 
											column
												.search( val ? '^'+val+'$' : '', true, false )
												.draw();
										} );
					 
									column.data().unique().sort().each( function ( d, j ) {
										select.append( '<option value="'+d+'">'+d+'</option>' )
									} );
								} );
							}
						}); 
						
					});

					registerEditDeleteDepartmentButtons();

				});

			}

		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		}
	});

	//Add a new department

	$("#addDepartment-btn").click(function() {

		$("#addDepartmentModal").modal("show");

	});

	$("#addDepartment-submit-btn").click(function() {

		if( $("#addDepartmentName").val() == "" ) {
		
			alert( "Please enter a valid department name");
			
			return false;

		}

		$.ajax({
			url: "php/insertDepartment.php",
			type: 'POST',
			data: {
				name: $("#addDepartmentName").val(),
				locationID: $("#addDepartmentLocation").val(),
				locationName: $("#addDepartmentLocation option:selected").text(),
				//Is this last one necessary?
			},
			dataType: "json",
			success: function(result) {

				$("#addDepartmentModal").modal("hide");
				$("#addDepartmentName").val("");

				console.log(result);

				var newDepartment = result['data'];

				let $tr = $('<tr data-id="' + newDepartment.id + '">').append(
					$('<td class="department-name">').text(newDepartment.departmentName),
					$('<td class="location-name">').text(newDepartment.locationName), 
					$('<td>').html(
						'<button class="editDepartment-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
						'<button class="deleteDepartment-btn btn text-danger" title="delete"><i class="fas fa-trash-alt"></i></button>'
					)
				).appendTo('#departmentsTable');

				registerEditDeleteDepartmentButtons();

			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
			}
			
		});

	});

	//Edit department

	var $currentDepartmentRow;

	$("#editDepartment-submit-btn").click( function() {
		
		if( $("#editDepartmentName").val() == "" ) {
			
			alert( "Please enter a valid department name");
			
			return false;

		}
		
		$.ajax({
			url: "php/editDepartment.php",
			type: 'POST',
			data: {
				name: $("#editDepartmentName").val(),
				locationID: $("#editDepartmentLocation").val(),
				locationName: $("#editDepartmentLocation option:selected").text(),
				id: $currentDepartmentRow.data("id"),
			},
			dataType: "json",
			success: function(result) {
				
				$("#editDepartmentModal").modal("hide");
				
				$("#editDepartmentName").val("");
				
				$("#editDepartmentLocation").val(1);

				var editDepartment = result['data'];
				
				$currentDepartmentRow.find("td.department-name").html( editDepartment.departmentName ); 
				
				$currentDepartmentRow.find("td.location-name").html( editDepartment.locationName );
				
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
			}
		});

	});
	
	function registerEditDeleteDepartmentButtons() {

		$(".editDepartment-btn").unbind("click");
		
		$(".deleteDepartment-btn").unbind("click");

		//Edit department

		$(".editDepartment-btn").click(function() {
			
			$currentDepartmentRow = $(this).closest('tr');
			
			$("#editDepartmentModal").modal("show");
	
			$('#editDepartmentName').val( $(this).closest('tr').find('.department-name').text() );
			
			$('#editDepartmentLocation').val( $('#editDepartmentLocation option:contains(' + $(this).closest('tr').find('.location-name').text() + ')').val() );
			
		});

		//Delete department button
			
		$(".deleteDepartment-btn").click(function() {
			
			$currentDepartmentRow = $(this).closest('tr');

			let p = confirm( "Are you sure you would like to delete this department?" );
			
			if (p == true) {
				
				$.ajax({
					url: "php/deleteDepartmentByID.php",
					type: 'POST',
					data: {
						id: $currentDepartmentRow.data("id"),
					},
					dataType: "json",
					success: function(result) {


						if (result.status.name == "ok") {

							$currentDepartmentRow.remove();
							
						} else if (result.status.name == "violation") {
								
							alert("Cannot delete...");
							
						}

					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log(jqXHR);
					}

				});
				
			}
			
		});
	
	}
	
	
	/**************/
	/***LOCATION***/
	/**************/
	

	//Populate, edit and delete location table

	$.ajax({
		url: "php/getAllLocations.php",
		type: 'POST',
		dataType: "json",
		success: function(result) {

			//console.log(result);

			if (result.status.name == "ok") {

				var locations = result['data'];

				$(function() {
					
					$.when($.each(locations, function(i, location) {
												
						let $tr = $('<tr data-id="' + location.id + '">').append(
							$('<td class="location-name">').text(location.name),
							$('<td>').html(
								'<button class="editLocation-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
								'<button class="deleteLocation-btn btn text-danger" title="delete"><i class="fas fa-trash-alt"></i></button>'
							)
						).appendTo('#locationTable tbody');

						//populate dropdown menu in add and edit modals

						//$('#addEmployeeLocation').append(`<option value="${location.id}">${location.name}</option>`);
						//$('#editEmployeeLocation').append(`<option value="${location.id}">${location.name}</option>`);
						
						$('#addDepartmentLocation').append(`<option value="${location.id}">${location.name}</option>`);						
						$('#editDepartmentLocation').append(`<option value="${location.id}">${location.name}</option>`);

					})).then( function() {

						$.when(

						registerEditDeleteLocationButtons()

						).then(function() {
						
							$("#locationTable").DataTable({
								responsive: true
							}); 

						});

					});
					

				});

			}

		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		}

	});
	
	//Add a new location

	$("#addLocation-btn").click(function() {

		$("#addLocationModal").modal("show");

	});

	$("#addLocation-submit-btn").click(function() {
		
		if( $("#addLocationName").val() == "" ) {
		
			alert( "Please enter a valid location name");
			
			return false;

		}

		$.ajax({
			url: "php/insertLocation.php",
			type: 'POST',
			data: {
				name: $("#addLocationName").val(),
			},
			dataType: "json",
			success: function(result) {

				$("#addLocationModal").modal("hide");
				
				$("#addLocationName").val("");

				console.log(result);

				var newLocation = result['data'];

				let $tr = $('<tr data-id="' + newLocation.id + '">').append(

					$('<td class="location-name">').text(newLocation.name),
					$('<td>').html(
						'<button class="editLocation-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
						'<button class="deleteLocation-btn btn text-danger" title="delete"><i class="fas fa-trash-alt"></i></button>'
					)
				).appendTo('#locationTable');
				
				registerEditDeleteLocationButtons();

			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
			}
		});

	});
	
	var $currentLocationRow;
	
	$("#editLocation-submit-btn").click(function() {
		
		if( $("#editLocationName").val() == "" ) {
			
			alert( "Please enter a valid location name");
			
			return false;

		}
		
		$.ajax({
			url: "php/editLocation.php",
			type: 'POST',
			data: {
				name: $("#editLocationName").val(),
				id: $currentLocationRow.data("id"),
			},
			dataType: "json",
			success: function(result) {
				
				$("#editLocationModal").modal("hide");
				
				$("#editLocationName").val("");

				console.log(result);

				var editLocation = result['data'];
				
				//update row's entry with new value
				
				$currentLocationRow.find("td.location-name").html( editLocation.name );
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
			}
		});
		

	});
	
	function registerEditDeleteLocationButtons() {	
		
		$(".editLocation-btn").unbind("click");
		
		$(".deleteLocation-btn").unbind("click");
		
		//Edit location

		$(".editLocation-btn").click(function() {

			$currentLocationRow = $(this).closest('tr');
			
			$("#editLocationModal").modal("show");
			
			$('#editLocationName').val( $(this).closest('tr').find('.location-name').text() );
			

		});

		//Delete button

		$(".deleteLocation-btn").click(function() {
			
			$currentLocationRow = $(this).closest('tr');

			let p = confirm( "Are you sure you would like to delete this location?" );

			if (p == true) {

				$.ajax({
					url: "php/deleteLocationByID.php",
					type: 'POST',
					data: {
						id: $currentLocationRow.data("id"),
					},
					dataType: "json",
					success: function(result) {

						console.log(result);
						
						if (result.status.name == "ok") {

							$currentLocationRow.remove();

						} else if (result.status.name == "violation") {
							
							alert("Cannot delete...");
							
						}


					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log(jqXHR);
					}

				});

			}

		});
		
	}

	$('#option1, #option2, #option3').on('click', function (e) {
		//e.stopPropagation();
		
		hideAllCards();
		if (this.id == 'option1') {
			$('#personnelCard').collapse('show');
		} else if (this.id == 'option2') {
			$('#departmentsCard').collapse('show');
		} else if (this.id == 'option3') {
			$('#locationCard').collapse('show');
		}
	});
	
	
	function hideAllCards(){
		$('#departmentsCard').collapse('hide');
		$('#locationCard').collapse('hide');
		$('#personnelCard').collapse('hide');	
	}	
	
	hideAllCards();

});

