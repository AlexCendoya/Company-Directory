$.ajax({
    url: "php/getAll.php",
    type: 'POST',
    dataType: "json",
    success: function(result) {

        //console.log(result);

        if (result.status.name == "ok") {

            var all = result['data'];


            $(function() {
                $.each(all, function(i, item) {
                    var $tr = $('<tr>').append(
                        $('<td>').text(item.lastName),
                        $('<td>').text(item.firstName),
                        $('<td>').text(item.department),
                        $('<td>').text(item.location),
                        $('<td>').text(
                            '<button class="view-btn btn text-primary" title="view"><i class="fas fa-eye"></i></button>;',
                            '<button class="edit-btn btn text-primary" title="edit"><i class="fas fa-edit"></i></button>;',
                            '<button class="delete-btn btn text-danger" title="delete"><i class="fas fa-trash"></i></button>;'
                        )
                    ).appendTo('#personnelTable');
                });


            });

            for (let i = 0; i < all.length; i++) {

                $('#employeeName').html(all[i].firstName + " " + all[i].lastName),
                $('#employeeEmail').html(all[i].email),
                $('#employeeDepartment').html(all[i].department),
                $('#employeeLocation').html(all[i].location)



            }


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
                $.each(departments, function(i, item) {
                    var $tr = $('<tr>').append(
                        $('<td>').text(item.name),
                        $('<td>').text(item.locationID),
                        $('<td>').text(
                            '<button class="edit-btn btn text-primary" title="edit"><i class="fas fa-edit"></i></button>;',
                            '<button class="delete-btn btn text-danger" title="delete"><i class="fas fa-trash"></i></button>;'
                        )
                    ).appendTo('#departmentsTable');
                });


            });


        }


    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
    }
});