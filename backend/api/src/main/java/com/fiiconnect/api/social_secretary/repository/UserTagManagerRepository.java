package com.fiiconnect.api.social_secretary.repository;

import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import com.fiiconnect.api.social_secretary.classes.UserTagManager;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.RepositoryDefinition;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Transactional
public interface UserTagManagerRepository  extends JpaRepository<UserTagManager,Long> {

    @Modifying//ca sa stie springu ca nu returneaza nimic(doar pt native sql queries)
    @Query(value="INSERT INTO USER_TAGS (USER_ID,TAG_ID) values (:userId,:tagId)",nativeQuery = true)
    void addTagToUser(@Param("userId")Long userId, @Param("tagId") Long tagId);

    @Query(value="SELECT TAG_ID FROM USER_TAGS where USER_ID= :userId",nativeQuery = true)
     List<Long> getAllUserTags(@Param("userId") Long userId);

    @Modifying
    @Query(value="DELETE FROM USER_TAGS WHERE USER_ID= :userId AND TAG_ID= :tagId",nativeQuery = true)
    void deleteByUserIdAndTagId(@Param("userId") Long userId,@Param("tagId") Long tagId);
}
