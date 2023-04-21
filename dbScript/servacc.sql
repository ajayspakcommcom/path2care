/*
    
    alter table employeebk add Division nvarchar(10)
    alter table employeebk add HiDocDoJ nvarchar(20)
    alter table employeebk add SeravaccDoJ nvarchar(20)

    update employeeBK set division = 'CRITIBIZZ' WHERE DIVISION IS NULL

INSERT INTO employeeBK (PASSWORD, EMAIL, FIRSTNAME, DESIGNATION, designationID, StateID, 
    MOBILENUMBER, hqName, empNumber, SeravaccDoJ,
     hqcode, division, HiDocDoJ
    )
SELECT 'SERA@332211',  employee_email_address, employee_name, designation, 0, 0,
employee_number, hq_name, employee_number, date_of_joining, 
 hq_code , 'SERAVACC' , hidoctor_start_date
FROM TBLSERA
where date_of_joining is not null

    
   

*/