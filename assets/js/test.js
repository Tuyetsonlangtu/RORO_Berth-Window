
CREATE OR REPLACE FUNCTION "FWDADM"."TL_GET_USER_NM" (I_USER_ID     VARCHAR2)
RETURN VARCHAR2 IS
USER_NM VARCHAR2(100);
BEGIN

"ABCD saaaa"
BEGIN
----Old-----------------
    /*SELECT T.USER_ENG_NM
     INTO USER_NM
     FROM TL_USER T
     WHERE T.USER_ID = I_USER_ID;*/
    ---------------------------------
        ----Modify by HoaiVo-------------
    SELECT T.USR_NM
INTO USER_NM
FROM COM_USER T
WHERE T.USR_ID = I_USER_ID;
------------------------------

    EXCEPTION
WHEN OTHERS THEN

USER_NM := '';
END;

RETURN USER_NM;
END TL_GET_USER_NM;
/

