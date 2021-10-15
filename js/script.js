$(document).ready( function () {
	

	
	
	$.ajax({
		url: "php/getAll.php",
		type: 'POST',
		dataType: "json",
		success: function(result) {

			//console.log(result);

			if (result.status.name == "ok") {

				var all = result['data'];

				//$('<span class="personnelEmail" data-email="' + personnel.email + '"></span>'),
				
				$(function() {
					$.each(all, function(i, personnel) {
						var $tr = $('<tr>').append(
							$('<td class="personnelLastName">').text(personnel.lastName),
							$('<td class="personnelFirstName">').text(personnel.firstName),
							$('<td class="personnelDepartment">').text(personnel.department),
							$('<td class="personnelLocation">').text(personnel.location),
							
							$('<td>').html(
								'<button class="view-btn btn text-primary" title="view"><i class="fas fa-eye"></i></button>' + 
								'<button class="edit-btn btn text-primary" title="edit"><i class="fas fa-edit"></i></button>' +
								'<button class="delete-btn btn text-danger" title="delete" data-id="' + personnel.id + '"><i class="fas fa-trash"></i></button>'
							),
							$('<span style="display:none" class="personnelEmail">').text(personnel.email),
						).appendTo('#personnelTable');
					});
					
					$(".view-btn").click( function() {
										
						$('#employeeName').html( $(this).closest('tr').find('.personnelFirstName').text() + " " +  $(this).closest('tr').find('.personnelLastName').text() );
						$('#employeeEmail').html( $(this).closest('tr').find('.personnelEmail').text() );
						$('#employeeDepartment').html( $(this).closest('tr').find('.personnelDepartment').text() );
						$('#employeeLocation').html( $(this).closest('tr').find('.personnelLocation').text() );

						$("#employeeModal").modal("show");
						
					});
					
					$(".delete-btn").click(function() {

						//alert( $(this).data("id") );
						var p = confirm( "Are you sure you would like to delete this personnel?" );
						
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

						var $tr = $('<tr>').append(
							$('<td>').text(department.name),
							$('<td>').text(department.location),
							$('<td>').html(
								'<button class="edit-btn btn text-primary" title="edit"><i class="fas fa-edit"></i></button>' +
								'<button class="delete-btn btn text-danger" title="delete"><i class="fas fa-trash"></i></button>'
							)
						).appendTo('#departmentsTable');

						/*
						var $tr = $('<tr>').append(
							$('<td>').text(department.location),
							$('<td>').html(
								'<button class="edit-btn btn text-primary" title="edit"><i class="fas fa-edit"></i></button>' +
								'<button class="delete-btn btn text-danger" title="delete"><i class="fas fa-trash"></i></button>'
							)
						).appendTo('#locationTable');
						*/

					});

				});


			}


		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		}
	});
	
});

