package com.fiiconnect.api.management_resurse;

import com.fiiconnect.api.didactic.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CereriRepository extends JpaRepository<Cereri, Integer> {

    // toate cererile unui student
    List<Cereri> findByStudent(Student student);

    // cereri filtrate după status (ex: "PENDING")
    List<Cereri> findByStatus(String status);

    // cereri după tip (ex: "ADV" sau "DEC")
    List<Cereri> findByTip(String tip);

    // cereri după student și status
    List<Cereri> findByStudentAndStatus(Student student, String status);

    // cereri trimise într-o anumită zi (atenție: dacă folosești tipul Date pentru dataTrimitere, poți compara mai ușor)
    List<Cereri> findByDataTrimitere(String dataTrimitere);

    // dacă vrei să le sortezi, Spring Data permite și
    List<Cereri> findByStudentOrderByDataTrimitereDesc(Student student);
}
