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
										
						$('#employeeName').html( $(this).closest('tr').find('.personnelFirstName').text() + " " +  $(this).closest('tr').find('.personnelLastName').text() );
						$('#employeeEmail').html( $(this).closest('tr').find('.personnelEmail').text() );
						$('#employeeDepartment').html( $(this).closest('tr').find('.personnelDepartment').text() );
						$('#employeeLocation').html( $(this).closest('tr').find('.personnelLocation').text() );

						$("#employeeModal").modal("show");
						
					});

					//add button

					$("#addEmployee-btn").click(function() {

						$("#addEmployeeModal").modal("show");

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

				});

				


			}


		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
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

						let $tr = $('<tr>').append(
							$('<td>').text(department.name),
							$('<td>').text(department.location),
							$('<td>').html(
								'<button class="editDepartment-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
								'<button class="deleteDepartment-btn btn text-danger" title="delete" data-id="' + department.id + '"><i class="fas fa-trash-alt"></i></button>'
							)
						).appendTo('#departmentsTable');
						
						//populate dropdown menu in add and edit modals

						$('#addEmployeeDepartment').append(`<option value="${department.id}">${department.name}</option>`);
						$('#editEmployeeDepartment').append(`<option value="${department.id}">${department.name}</option>`);


					});

					//Add a new department

					$("#addDepartment-btn").click(function() {

						$("#addDepartmentModal").modal("show");

					});


					$("#addDepartment-btn").submit(function() {

						$.ajax({
							url: "php/insertDepartment.php",
							type: 'POST',
							data: {
								name: $("#addDepartmentName"),
								locationID: $("#addDepartmentLocation").val(),
							},
							dataType: "json",
							success: function(result) {

								console.log(result);

								var newDepartment = result['data'];

								let $tr = $('<tr>').append(
									$('<td>').text(newDepartment.name),
									$('<td>').text(newDepartment.location),
									$('<td>').html(
										'<button class="editDepartment-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
										'<button class="deleteDepartment-btn btn text-danger" title="delete" data-id="' + newDepartment.id + '"><i class="fas fa-trash-alt"></i></button>'
									)
								).appendTo('#departmentsTable');

							},
							error: function(jqXHR, textStatus, errorThrown) {
								console.log(jqXHR);
							}
						});
					});


					//Edit department

					$(".editDepartment-btn").click(function() {

						$("#editDepartmentModal").modal("show");

					});

					$(".deleteDepartment-btn").click(function() {

					
						let p = confirm( "Are you sure you would like to delete this department?" );
						
						if (p == true) {
							
							$.ajax({
								url: "php/deleteDepartmentByID.php",
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

				});


			}


		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		}
	});


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
												
						let $tr = $('<tr>').append(
							$('<td>').text(location.name),
							$('<td>').html(
								'<button class="editLocation-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
								'<button class="deleteLocation-btn btn text-danger" title="delete" data-id="' + location.id + '"><i class="fas fa-trash-alt"></i></button>'
							),

						).appendTo('#locationTable');

						//populate dropdown menu in add and edit modals

						$('#addEmployeeLocation').append(`<option value="${location.id}">${location.name}</option>`);
						$('#addDepartmentLocation').append(`<option value="${location.id}">${location.name}</option>`);
						$('#editEmployeeLocation').append(`<option value="${location.id}">${location.name}</option>`);
						$('#editDepartmentLocation').append(`<option value="${location.id}">${location.name}</option>`);


						$("#addLocation-btn").click(function() {

							$("#addLocationModal").modal("show");
	
						});

						$(".editLocation-btn").click(function() {

							$("#editLocationModal").modal("show");
	
						});

						$(".deleteLocation-btn").click(function() {

							let p = confirm( "Are you sure you would like to delete this location?" );

							if (p == true) {
							
								$.ajax({
									url: "php/deleteLocationByID.php",
									type: 'POST',
									data: {
										id: $(this).data("id"),
									},
									dataType: "json",
									success: function(result) {
	
										console.log(result);
	
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


						

					});


				});

			}

		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		}

	});


	
});

