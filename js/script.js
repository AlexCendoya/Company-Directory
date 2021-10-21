$(document).ready( function () {


	
	//Populate, edit and delete personnel table
	
	$.ajax({
		url: "php/getAll.php",
		type: 'POST',
		dataType: "json",
		success: function(result) {

			//console.log(result);

			if (result.status.name == "ok") {

				var all = result['data'];
				
				$(function() {
					$.each(all, function(i, personnel) {
						let $tr = $('<tr>').append(
							$('<td class="personnelLastName">').text(personnel.lastName),
							$('<td class="personnelFirstName">').text(personnel.firstName),
							$('<td class="personnelDepartment">').text(personnel.department),
							$('<td class="personnelLocation">').text(personnel.location),
							
							$('<td>').html(
								'<button class="info-btn btn text-primary" title="view"><i class="fas fa-info"></i></button>' + 
								'<button class="editEmployee-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
								'<button class="deletePersonnel-btn btn text-danger" title="delete" data-id="' + personnel.id + '"><i class="fas fa-trash-alt"></i></button>'
							),
							$('<span style="display:none" class="personnelEmail">').text(personnel.email),
						).appendTo('#personnelTable');
					});
					
					$(".info-btn").click(function() {
										
						$('#employeeName').html( $(this).closest('tr').find('.personnelFirstName').text() + " " + $(this).closest('tr').find('.personnelLastName').text() );
						$('#employeeEmail').html( $(this).closest('tr').find('.personnelEmail').text() );
						$('#employeeDepartment').html( $(this).closest('tr').find('.personnelDepartment').text() );
						$('#employeeLocation').html( $(this).closest('tr').find('.personnelLocation').text() );

						$("#employeeModal").modal("show");
						
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

		if (($("#addEmployeeFirstName").val() == "" ) || ($("#addEmployeeLastName").val() == "" ) || ($("#addEmployeeJobTitle").val() == "" )|| ($("#addEmployeeEmail").val() == "" )) {
		
			alert( "Please enter all the required fields");
			
			return false;

			//But what if you want to change just one or two fields?

		}

		$.ajax({
			url: "php/insertEmployee.php",
			type: 'POST',
			data: {
				firstname: $("#addEmployeeFirstName").val(),
				lastname: $("#addEmployeeLastName").val(),
				jobtitle: $("#addEmployeeJobTitle").val(),
				email: $("#addEmployeeEmail").val(),
				department: $("#addEmployeeDepartment").val(),
				locationID: $("#addEmployeeLocation").val(),
			},
			dataType: "json",
			success: function(result) {

				console.log(result);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
				
			}

		});
	});

	//edit button

	$(".editEmployee-btn").click(function() {

		$("#editEmployeeModal").modal("show");

	});
					
	$(".deletePersonnel-btn").click(function() {

		//alert( $(this).data("id") );
		let p = confirm( "Are you sure you would like to delete this personnel?" );
		
		if (p == true) {
			
			$.ajax({
				url: "php/deletePersonnelByID.php",
				type: 'POST',
				data: {
					id: $(this).data("id"),
				},
				dataType: "json",
				success: function(result) {

					//console.log(result);

					if (result.status.name == "ok") {

						alert("Deleted");

					}

				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
					
				}

			});
			
		}
		
	});


	//Populate, edit and delete department table

	$.ajax({
		url: "php/getAllDepartments.php",
		type: 'POST',
		dataType: "json",
		success: function(result) {

			console.log(result);

			if (result.status.name == "ok") {

				var departments = result['data'];

				$(function() {
					$.each(departments, function(i, department) {

						let $tr = $('<tr data-id="' + department.id + '">').append(
							$('<td class="department-name">').text(department.name),
							$('<td>').text(department.location), //should I add class here?
							$('<td>').html(
								'<button class="editDepartment-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
								'<button class="deleteDepartment-btn btn text-danger" title="delete"><i class="fas fa-trash-alt"></i></button>'
							)
						).appendTo('#departmentsTable');
						
						//populate dropdown menu in add and edit modals

						$('#addEmployeeDepartment').append(`<option value="${department.id}">${department.name}</option>`);
						$('#editEmployeeDepartment').append(`<option value="${department.id}">${department.name}</option>`);


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
			},
			dataType: "json",
			success: function(result) {

				$("#addDepartmentModal").modal("hide");
				
				$("#addDepartmentName").val("");

				console.log(result);

				var newDepartment = result['data'];

				let $tr = $('<tr data-id="' + newDepartment.id + '">').append(
					$('<td class="department-name">').text(newDepartment.name),
					$('<td>').text(newDepartment.location), //should I include class here too?
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

	//Edit department --- in progress


	$("#editDepartment-submit-btn").click(function() {
		
		if( $("#editDepartmentName").val() == "" ) {
			
			alert( "Please enter a valid department name");
			
			return false;

		}
			
		var $editDepartmentButton = $(this);
		

		$.ajax({
			url: "php/editDepartment.php",
			type: 'POST',
			data: {
				name: $("#editDepartmentName").val(),
				id: $("#editDepartmentLocation").val(),
				 /*$currentEditDepartmentID.data("id")*/
			},
			dataType: "json",
			success: function(result) {
				
				$("#editDepartmentModal").modal("hide");
				
				$("#editDepartmentName").val("");

				console.log(result);

				var editDepartment = result['data'];
				
				//update row's entry with new value
				
				//$currentEditDepartmentID.find("td.department-name").html(editDepartment.name);

				$("#editDepartmentLocation").find("td.department-name").html(editDepartment.name); //Attempt with the ID from the dropdown
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
			}
		});


	},



	function registerEditDeleteDepartmentButtons() {


		$(".editDepartment-btn").unbind("click");
		
		$(".deleteDepartment-btn").unbind("click");

		//Edit department



		$(".editDepartment-btn").click(function() {

			$("#editDepartmentModal").modal("show");
	
			$('#editDepartmentName').val( $(this).closest('tr').find('.department-name').text() );
						/*
			$currentEditDepartmentID = $(this).closest('tr');
					*/
	
		});



		//Delete button
			
		$(".deleteDepartment-btn").click(function() {

			var $deleteDepartmentButton = $(this);
		
			let p = confirm( "Are you sure you would like to delete this department?" );
			
			if (p == true) {
				
				$.ajax({
					url: "php/deleteDepartmentByID.php",
					type: 'POST',
					data: {
						id: $deleteDepartmentButton.parent().parent().data("id"),
						/*id: $(this).data("id"),*/
					},
					dataType: "json",
					success: function(result) {

						//console.log(result);

						if (result.status.name == "ok") {

							alert("Deleted");

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

	}),


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
					
					$.each(locations, function(i, location) {
												
						let $tr = $('<tr data-id="' + location.id + '">').append(
							$('<td class="location-name">').text(location.name),
							$('<td>').html(
								'<button class="editLocation-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
								'<button class="deleteLocation-btn btn text-danger" title="delete"><i class="fas fa-trash-alt"></i></button>'
							),

						).appendTo('#locationTable');

						//populate dropdown menu in add and edit modals

						$('#addEmployeeLocation').append(`<option value="${location.id}">${location.name}</option>`);
						$('#addDepartmentLocation').append(`<option value="${location.id}">${location.name}</option>`);
						$('#editEmployeeLocation').append(`<option value="${location.id}">${location.name}</option>`);
						$('#editDepartmentLocation').append(`<option value="${location.id}">${location.name}</option>`);

					});
					
					registerEditDeleteLocationButtons();



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
					),
				).appendTo('#locationTable');
				
				registerEditDeleteLocationButtons();



			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
			}
		});

	});
	
	var $currentEditLocationID;
	
	$("#editLocation-submit-btn").click(function() {
		
		if( $("#editLocationName").val() == "" ) {
			
			alert( "Please enter a valid location name");
			
			return false;

		}
		
		var $editLocationButton = $(this);
		
		$.ajax({
			url: "php/editLocation.php",
			type: 'POST',
			data: {
				name: $("#editLocationName").val(),
				id: $currentEditLocationID.data("id"),
			},
			dataType: "json",
			success: function(result) {
				
				$("#editLocationModal").modal("hide");
				
				$("#editLocationName").val("");

				console.log(result);

				var editLocation = result['data'];
				
				//update row's entry with new value
				
				$currentEditLocationID.find("td.location-name").html( editLocation.name );
				$("table.table").DataTable({
					"paging": false
				});
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

			$("#editLocationModal").modal("show");
			
			$('#editLocationName').val( $(this).closest('tr').find('.location-name').text() );
			
			$currentEditLocationID = $(this).closest('tr');

		});

		//Delete button

		$(".deleteLocation-btn").click(function() {
			
			var $deleteLocationButton = $(this);

			let p = confirm( "Are you sure you would like to delete this location?" );

			if (p == true) {

				$.ajax({
					url: "php/deleteLocationByID.php",
					type: 'POST',
					data: {
						id: $deleteLocationButton.parent().parent().data("id"),
					},
					dataType: "json",
					success: function(result) {

						console.log(result);
						
						if (result.status.name == "ok") {

							$deleteLocationButton.parent().parent().remove();

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

	//Database settings

	$(".table").DataTable();

	//go through this again: https://datatables.net/forums/discussion/50329/first-time-using-datatables-no-data-available-in-table
	
});

