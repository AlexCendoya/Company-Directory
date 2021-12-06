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
							
							$('<td class="personnelOptions">').html(
								'<button class="info-btn btn text-primary" title="view"><i class="fas fa-info"></i></button>' + 
								'<button class="editEmployee-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
								'<button class="deletePersonnel-btn btn text-danger" title="delete""><i class="fas fa-trash-alt"></i></button>'
							),
							$('<span style="display:none" class="personnelEmail">').text(personnel.email),
							$('<span style="display:none" class="personnelJobTitle">').text(personnel.jobTitle)

						).appendTo('#personnelTable tbody');
						
					})).then(function() {
							
						$.when( 
							
							registerEditDeleteEmployeeButtons()
						
						).then(function() {
						
							$("#personnelTable").DataTable({
								responsive: true,
								scrollY: "60vh",
								paging: false,
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
										});
									});
								}

							}).columns.adjust().responsive.recalc(); 

							
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

		//$("#addEmployee-submit-btn").attr( "disabled", false );

		$("#notEmptyPersonnelAlert1").html("");

		$("#addPersonnelModal").modal("show");

	});


	$("#addEmployee-submit-btn").click(function() {

		if (($("#addEmployeeFirstName").val() == "" ) || ($("#addEmployeeLastName").val() == "" ) || ($("#addEmployeeEmail").val() == "" )) {
		
			$('#notEmptyPersonnelAlert1').html("<div class='alert alert-danger' role='alert'>Please enter all the required fields.</div>");
			
			return false;

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
				locationName: $locationName,

			},
			dataType: "json",
			success: function(result) {

				$("#addPersonnelModal").modal("hide");

				//console.log(result);

				$("#personnelTable").DataTable().destroy();

				var newEmployee = result['data'];

				let $tr = $('<tr data-id="' + newEmployee.id + '">').append(

					$('<td class="personnelLastName">').text(newEmployee.lastName),
					$('<td class="personnelFirstName">').text(newEmployee.firstName),
					$('<td class="personnelDepartment" data-department-id="' + $("#addEmployeeDepartment").val() + '">').text(newEmployee.departmentName),
					$('<td class="personnelLocation">').text(newEmployee.locationName),
					$('<td class="personnelOptions">').html(
						'<button class="info-btn btn text-primary" title="view"><i class="fas fa-info"></i></button>' + 
						'<button class="editEmployee-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
						'<button class="deletePersonnel-btn btn text-danger" title="delete"><i class="fas fa-trash-alt"></i></button>'
					),
					$('<span style="display:none" class="personnelEmail">').text(newEmployee.email),
					$('<span style="display:none" class="personnelJobTitle">').text(newEmployee.jobTitle)

				).appendTo('#personnelTable');

				$('#personnelTable').DataTable({responsive: true, scrollY: "60vh",paging: false}).draw();
				
				$("#addEmployeeFirstName").val("");
				$("#addEmployeeLastName").val("");
				$("#addEmployeeJobTitle").val("");
				$("#addEmployeeEmail").val("");
				$("#addEmployeeDepartment").val(0);

				registerEditDeleteEmployeeButtons();

				//$("#addEmployee-submit-btn").attr( "disabled", true );


			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
				
			}

		});
	});


	//Edit personnel

	var $currentPersonnelRow;

	$("#editPersonnel-submit-btn").click(function() {

		if (($("#editEmployeeFirstName").val() == "" ) || ($("#editEmployeeLastName").val() == "" ) || ($("#editEmployeeEmail").val() == "" )) {

			$('#notEmptyPersonnelAlert2').html("<div class='alert alert-danger' role='alert'>Please enter all the required fields.</div>");
			
			return false;
		}

		$("#editPersonnelModal").modal("hide");

		$("#confirmEditPersonnel-submit-btn").attr( "disabled", false );
		
		//$("#cancelEditPersonnel-submit-btn").attr( "disabled", false );	

		$("#confirmEditPersonnelAlert").html("");

		$("#confirmEditPersonnelModal").modal("show");

	});


	$("#cancelEditPersonnel-submit-btn").click(function() {

		$("#confirmEditPersonnelModal").modal("hide");

	});

	$("#confirmEditPersonnel-submit-btn").click(function() {
		
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
				locationName: $locationName,
				id: $currentPersonnelRow.data("id"),

			},
			dataType: "json",
			success: function(result) {

				$("#editEmployeeFirstName").val("");
				$("#editEmployeeLastName").val("");
				$("#editEmployeeJobTitle").val("");
				$("#editEmployeeEmail").val("");
				$("#addEmployeeDepartment").val(0);

				//console.log(result);

				var editEmployee = result['data'];
				
				$currentPersonnelRow.find("td.personnelLastName").html(editEmployee.lastName);
				$currentPersonnelRow.find("td.personnelFirstName").html(editEmployee.firstName); 
				$currentPersonnelRow.find("span.personnelEmail").html(editEmployee.email);
				$currentPersonnelRow.find("span.personnelJobTitle").html(editEmployee.jobTitle); 
				$currentPersonnelRow.find("td.personnelDepartment").html(editEmployee.departmentName);  
				$currentPersonnelRow.find("td.personnelLocation").html(editEmployee.locationName);  

				$("#confirmEditPersonnelAlert").html("<div class='alert alert-success' role='alert'>Employee successfully edited.</div>");

				$("#confirmEditPersonnel-submit-btn").attr("disabled", true);

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

		//Personnel Info
		
		$(".info-btn").click(function() {
			
			$currentPersonnelRow = $(this).closest('tr');
										
			$('#employeeName').html("<i class='fas fa-users'></i> " + $currentPersonnelRow.find('.personnelFirstName').text() + " " + $currentPersonnelRow.find('.personnelLastName').text() );
			$('#employeeEmail').html( $currentPersonnelRow.find('.personnelEmail').text() );

			if($currentPersonnelRow.find('.personnelJobTitle').text() == "") {

				$('#employeeJobTitle').html("<i>Please introduce a position</i>");

			} else {

				$('#employeeJobTitle').html( $currentPersonnelRow.find('.personnelJobTitle').text() );

			}

			$('#employeeDepartment').html( $currentPersonnelRow.find('.personnelDepartment').text() );
			$('#employeeLocation').html( $currentPersonnelRow.find('.personnelLocation').text() );

			$("#employeeModal").modal("show");

		});


		//Edit Personnel

		$(".editEmployee-btn").click(function() {
			
			$currentPersonnelRow = $(this).closest('tr');

			$("#notEmptyPersonnelAlert2").html("");

			$.ajax({
				url: "php/getPersonnelByID.php",
				type: 'POST',
				data: {
					id: $currentPersonnelRow.data("id"),
				},
				dataType: "json",
				success: function(result) {

					//console.log(result);
	
					if (result.status.name == "ok") {

						console.log(result["data"]);
							
						$('#editEmployeeLastName').val( result.data.personnel[0].lastName );
						$('#editEmployeeFirstName').val( result.data.personnel[0].firstName );
						$('#editEmployeeEmail').val( result.data.personnel[0].email );
						$('#editEmployeeJobTitle').val( result.data.personnel[0].jobTitle );
						$('#editEmployeeDepartment').val( result.data.personnel[0].departmentID );

						$("#editPersonnelModal").modal("show");
					}

				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
					
				}
			});


		});


		//Delete Personnel

		$(".deletePersonnel-btn").click(function() {

			$("#confirmDeletePersonnel-submit-btn").unbind("click");

			$('#personnelVictim').html("");

			$currentPersonnelRow = $(this).closest('tr');

			$('#personnelVictim').html($currentPersonnelRow.find('.personnelFirstName').text() + " " +  
			$currentPersonnelRow.find('.personnelLastName').text() + " (" + 
			$currentPersonnelRow.find('.personnelDepartment').text() + ")");

			$("#confirmDeletePersonnel-submit-btn").attr( "disabled", false );

			$('#confirmDeletePersonnelAlert').html("");

			$('#confirmDeletePersonnelModal').modal("show");
	
			$('#confirmDeletePersonnel-submit-btn').click(function() {
				
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

							$("#personnelTable").DataTable().destroy();
							
							$currentPersonnelRow.remove();

							$('#confirmDeletePersonnelAlert').html("<div class='alert alert-success' role='alert'>Employee successfully deleted.</div>");

							$("#confirmDeletePersonnel-submit-btn").attr( "disabled", true );

							$('#personnelTable').DataTable({responsive: true, scrollY: "60vh", paging: false}).draw();
						}
	
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log(jqXHR);
						
					}
	
				});
				
			});

			$('#cancelDeletePersonnel-submit-btn').click(function() {

				$('#confirmDeletePersonnelModal').modal("hide");

			});
			
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

						if (!department.totalPersonnel) {
							department.totalPersonnel = 0;
						}

						let $tr = $('<tr data-id="' + department.id + '">').append(
							$('<td class="department-name">').text(department.name),
							$('<td class="location-name">').text(department.location),
							$('<td>').text(department.totalPersonnel),
							$('<td class="departmentOptions">').html(
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
							scrollY: "60vh", //maximum with no table overflow on phones
							paging: false,
							initComplete: function () {
								this.api().columns().every( function () {
									var column = this;

									var some = column.index();
									if (column.index() == 3) return;

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
									});
								});
								
								
								
							}
						}).columns.adjust().responsive.recalc(); 

						
					}).then(function() {
						
						$('#departmentsCard').css("display", "none");
						
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

		$("#notEmptyDepartmentAlert1").html("");

		$("#addDepartmentModal").modal("show");

	});

	$("#addDepartment-submit-btn").click(function() {

		if( $("#addDepartmentName").val() == "" ) {
		
			$('#notEmptyDepartmentAlert1').html("<div class='alert alert-danger' role='alert'>Please enter a valid department name.</div>");
			
			return false;

		}

		$.ajax({
			url: "php/insertDepartment.php",
			type: 'POST',
			data: {
				name: $("#addDepartmentName").val(),
				locationID: $("#addDepartmentLocation").val(),
				locationName: $("#addDepartmentLocation option:selected").text(),
			},
			dataType: "json",
			success: function(result) {

				$("#addDepartmentModal").modal("hide");
				$("#addDepartmentName").val("");

				//console.log(result);

				$("#departmentsTable").DataTable().destroy(); //do it also for deleting

				var newDepartment = result['data'];

				if (!newDepartment.totalPersonnel) {
					newDepartment.totalPersonnel = 0;
				}

				let $tr = $('<tr data-id="' + newDepartment.id + '">').append(
					$('<td class="department-name">').text(newDepartment.departmentName),
					$('<td class="location-name">').text(newDepartment.locationName),
					$('<td>').text(newDepartment.totalPersonnel),					 
					$('<td class="departmentOptions">').html(
						'<button class="editDepartment-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
						'<button class="deleteDepartment-btn btn text-danger" title="delete"><i class="fas fa-trash-alt"></i></button>'
					)
				).appendTo('#departmentsTable');

				$('#departmentsTable').DataTable({responsive: true, scrollY: "60vh", paging: false}).draw();

				$('#addEmployeeDepartment').append('<option value="' + newDepartment.id + '">' + newDepartment.departmentName + ' (' + newDepartment.locationName + ')</option>');
				$('#editEmployeeDepartment').append('<option value="' + newDepartment.id + '">' + newDepartment.departmentName + ' (' + newDepartment.locationName + ')</option>');

				registerEditDeleteDepartmentButtons();

			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
			}
			
		});

	});

	//Edit department

	var $currentDepartmentRow;

	$("#editDepartment-submit-btn").click(function() {

		if( $("#editDepartmentName").val() == "" ) {
			
			$("#notEmptyDepartmentAlert2").html("<div class='alert alert-danger' role='alert'>Please enter a valid department name.</div>");
			
			return false;

		} 

		$("#editDepartmentModal").modal("hide");

		$("#confirmEditDepartment-submit-btn").attr( "disabled", false );

		$("#confirmEditDepartmentAlert").html("");

		$("#confirmEditDepartmentModal").modal("show");

	});

	$("#cancelEditDepartment-submit-btn").click(function() {

		$("#confirmEditDepartmentModal").modal("hide");

	});

	$("#confirmEditDepartment-submit-btn").click(function() {
		

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
				
				$("#editDepartmentName").val("");
				
				$("#editDepartmentLocation").val(1);

				var editDepartment = result['data'];
				
				$currentDepartmentRow.find("td.department-name").html( editDepartment.departmentName ); 
				$currentDepartmentRow.find("td.location-name").html( editDepartment.locationName );

				$("#confirmEditDepartmentAlert").html("<div class='alert alert-success' role='alert'>Department successfully edited.</div>");
				
				$("#confirmEditDepartment-submit-btn").attr( "disabled", true );
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

			$("#notEmptyDepartmentAlert2").html("");


			$.ajax({

				url: "php/getDepartmentByID.php",
				type: 'POST',
				data: {
					id: $currentDepartmentRow.data("id"),
				},
				dataType: "json",
				success: function(result) {
					
					//console.log(result);

					if (result.status.name == "ok") {

						$('#editDepartmentName').val( result["data"][0]["name"] );
						$('#editDepartmentLocation').val(result["data"][0]["locationID"]);

						$("#editDepartmentModal").modal("show");

					}

				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
				}

			});


		});


		//Delete department button
			
		$(".deleteDepartment-btn").click(function() {

			$currentDepartmentRow = $(this).closest('tr');

			$.ajax({
				url: "php/deleteDepartmentByID.php",
				type: 'POST',
				data: {
					id: $currentDepartmentRow.data("id"),
				},
				dataType: "json",
				success: function(result) {

					//console.log(result);

					if (result.status.name == "ok") {

						$("#confirmDeleteDepartment-submit-btn").unbind("click");

						$('#departmentVictim').html("");

						$('#confirmDeleteDepartmentModal').modal("show");

						$('#departmentVictim').html($currentDepartmentRow.find('.department-name').text());

						$("#confirmDeleteDepartment-submit-btn").attr("disabled", false);
			
						$('#confirmDeleteDepartmentAlert').html("");


						$('#confirmDeleteDepartment-submit-btn').click(function() {

							$('#addEmployeeDepartment').find(`option[value="${$currentDepartmentRow.data('id')}"]`).remove();					
							$('#editEmployeeDepartment').find(`option[value="${$currentDepartmentRow.data('id')}"]`).remove();

							$("#departmentsTable").DataTable().destroy();

							$currentDepartmentRow.remove();

							$('#confirmDeleteDepartmentAlert').html("<div class='alert alert-success' role='alert'>Department successfully deleted.</div>");
	
							$("#confirmDeleteDepartment-submit-btn").attr("disabled", true);

							$('#departmentsTable').DataTable({responsive: true, scrollY: "60vh", paging: false}).draw();
							//I am not reincluding the filters, but it works for the moment 	
						});

						$('#cancelDeleteDepartment-submit-btn').click(function() {

							$('#confirmDeleteDepartmentModal').modal("hide");
			
						});

						
					} else if (result.status.name == "violation") {

						$('#denyDeleteDepartmentAlert').html("<div class='alert alert-danger' role='alert'>This department cannot be deleted.</div>");

						$('#denyDepartmentVictim').html($currentDepartmentRow.find('.department-name').text());

						$('#closeDenyDeleteDepartment-btn').click(function () {

							$('#denyDeleteDepartmentModal').modal("hide");

						});

						$('#denyDeleteDepartmentModal').modal("show");

					}

				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
				}

			});
		
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

						if (!location.departmentsNumber) {
							location.departmentsNumber = 0;
						}
												
						let $tr = $('<tr data-id="' + location.id + '">').append(
							$('<td class="location-name">').text(location.name),
							$('<td>').text(location.departmentsNumber),
							$('<td class="locationOptions">').html(
								'<button class="editLocation-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
								'<button class="deleteLocation-btn btn text-danger" title="delete"><i class="fas fa-trash-alt"></i></button>'
							)
						).appendTo('#locationTable tbody');

						//populate dropdown menu in add and edit modals
					
						$('#addDepartmentLocation').append(`<option value="${location.id}">${location.name}</option>`);						
						$('#editDepartmentLocation').append(`<option value="${location.id}">${location.name}</option>`);

					})).then(function() {

						$.when(

						registerEditDeleteLocationButtons()

						).then(function() {
						
							$("#locationTable").DataTable({
								responsive: true,
								//scrollY: "37vh", //maximum size with no scroll bar
								paging: false
							}).columns.adjust().responsive.recalc(); 

						}).then(function() {
							
							$('#locationCard').css("display", "none");
							
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

		$("#notEmptyLocationAlert1").html("");

		$("#addLocationModal").modal("show");

	});

	$("#addLocation-submit-btn").click(function() {
		
		if( $("#addLocationName").val() == "" ) {
		
			$("#notEmptyLocationAlert1").html("<div class='alert alert-danger' role='alert'>Please enter a valid location name.</div>");
			
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

				//console.log(result);

				$("#locationTable").DataTable().destroy();

				var newLocation = result['data'];

				if (!newLocation.departmentsNumber) {
					newLocation.departmentsNumber = 0;
				}

				let $tr = $('<tr data-id="' + newLocation.id + '">').append(

					$('<td class="location-name">').text(newLocation.name),
					$('<td>').text(newLocation.departmentsNumber),
					$('<td class="locationOptions">').html(
						'<button class="editLocation-btn btn text-secondary" title="edit"><i class="fas fa-marker"></i></button>' +
						'<button class="deleteLocation-btn btn text-danger" title="delete"><i class="fas fa-trash-alt"></i></button>'
					)
				).appendTo('#locationTable');

				$('#locationTable').DataTable({responsive: true, paging: false}).draw();

				$('#addDepartmentLocation').append(`<option value="${newLocation.id}">${newLocation.name}</option>`);						
				$('#editDepartmentLocation').append(`<option value="${newLocation.id}">${newLocation.name}</option>`);

				registerEditDeleteLocationButtons()

			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
			}
		});

	});


	var $currentLocationRow;
	
	$("#editLocation-submit-btn").click(function() {

		if( $("#editLocationName").val() == "" ) {
			
			$("#notEmptyLocationAlert2").html("<div class='alert alert-danger' role='alert'>Please enter a valid location name.</div>");
			
			return false;

		} 

		$("#editLocationModal").modal("hide");

		$("#confirmEditLocation-submit-btn").attr("disabled", false);

		$("#confirmEditLocationAlert").html("");

		$("#confirmEditLocationModal").modal("show");

	});

	$("#cancelEditLocation-submit-btn").click(function() {

		$("#confirmEditLocationModal").modal("hide");

	});


	$("#confirmEditLocation-submit-btn").click(function() {
		
		$.ajax({
			url: "php/editLocation.php",
			type: 'POST',
			data: {
				name: $("#editLocationName").val(),
				id: $currentLocationRow.data("id"),
			},
			dataType: "json",
			success: function(result) {
				
				$("#editLocationName").val("");

				//console.log(result);

				var editLocation = result['data'];
				
				//update row's entry with new value
				
				$currentLocationRow.find("td.location-name").html(editLocation.name);

				$("#confirmEditLocationAlert").html("<div class='alert alert-success' role='alert'>Location successfully edited.</div>");

				$("#confirmEditLocation-submit-btn").attr("disabled", true);

			
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

			$("#notEmptyLocationAlert2").html("");

			$.ajax({
				url: "php/getLocationByID.php",
				type: 'POST',
				data: {
					id: $currentLocationRow.data("id"),
				},
				dataType: "json",
				success: function(result) {

					//console.log(result);

					if (result.status.name == "ok") {

						$('#editLocationName').val( result["data"][0]["name"] );

						$("#editLocationModal").modal("show");
					}

				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
				}
			});


		});


		//Delete button

		$(".deleteLocation-btn").click(function() {

			$currentLocationRow = $(this).closest('tr');

			$.ajax({
				url: "php/deleteLocationByID.php",
				type: 'POST',
				data: {
					id: $currentLocationRow.data("id"),
				},
				dataType: "json",
				success: function(result) {

					//console.log(result);
					
					if (result.status.name == "ok") {

						$("#confirmDeleteLocation-submit-btn").unbind("click");

						$('#locationVictim').html("");

						$('#confirmDeleteLocationModal').modal("show");	

						$('#locationVictim').html($currentLocationRow.find('.location-name').text());
			
						$("#confirmDeleteLocation-submit-btn").attr( "disabled", false);
			
						$('#confirmDeleteLocationAlert').html("");
			
						$('#confirmDeleteLocation-submit-btn').click(function() {

							$('#addDepartmentLocation').find(`option[value="${$currentLocationRow.data('id')}"]`).remove();					
							$('#editDepartmentLocation').find(`option[value="${$currentLocationRow.data('id')}"]`).remove();

							$("#locationTable").DataTable().destroy();

							$currentLocationRow.remove();

							$('#confirmDeleteLocationAlert').html("<div class='alert alert-success' role='alert'>Location successfully deleted.</div>");
			
							$("#confirmDeleteLocation-submit-btn").attr( "disabled", true );

							$('#locationTable').DataTable({responsive: true, paging: false}).draw();			
						
						});

						
						$('#cancelDeleteLocation-submit-btn').click(function() {
			
							$('#confirmDeleteLocationModal').modal("hide");
			
						});

					} else if (result.status.name == "violation") {
						
						$('#denyDeleteLocationAlert').html("<div class='alert alert-danger' role='alert'>This location cannot be deleted.</div>");

						$('#denyLocationVictim').html($currentLocationRow.find('.location-name').text());

						$('#closeDenyDeleteLocation-btn').click(function () {

							$('#denyDeleteLocationModal').modal("hide");

						});

						$('#denyDeleteLocationModal').modal("show");

					}

				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
				}

			});


		});
		
	}

	
	$('#option1, #option2, #option3').click(function () {
		
		$('#personnelCard').css("display", "none");
		$('#departmentsCard').css("display", "none");
		$('#locationCard').css("display", "none");
		
		$('#choosePersonnel').removeClass("active");
		$('#chooseDepartments').removeClass("active");
		$('#chooseLocation').removeClass("active");
		
		if (this.id == 'option1') {

			$('#personnelCard').css("display", "block");
			
			$('#choosePersonnel').addClass("active");

			
		} else if (this.id == 'option2') {
			
			$('#departmentsCard').css("display", "block");
			
			$('#chooseDepartments').addClass("active");

		} else if (this.id == 'option3') {
			
			$('#locationCard').css("display", "block");
			
			$('#chooseLocation').addClass("active");

		}
		
		$("#personnelTable").DataTable().draw();
		$("#departmentsTable").DataTable().draw();
		$("#locationTable").DataTable().draw();
		
		//redraw again when in mobile view
		$("#personnelTable").DataTable().draw();
		$("#departmentsTable").DataTable().draw();
		$("#locationTable").DataTable().draw();

		
	});
	

	window.onresize = function(event) {
		document.location.reload(true);
	}
	
	$("#preloader").hide();

});