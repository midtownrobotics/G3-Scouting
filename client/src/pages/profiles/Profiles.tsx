import { UserProfile } from "@shared/schemas/user"
import { useEffect, useState } from "react";
import { fetchAPIJSON } from "../../API";
import { z } from "zod";
import { Card, Col, FormControl, Row } from "react-bootstrap";
import { useUserData } from "../../userData";

export function Profiles() {
    const [profileData, setProfileData] = useState<UserProfile[]>([]);
    const { userData } = useUserData();

    const [searchContent, setSearchContent] = useState("");

    useEffect(() => {
        fetchAPIJSON("/profiles", z.array(UserProfile)).then(res => res && setProfileData(res));
    }, [])

    const searchFilter = (profile: UserProfile) => {
        return (profile.username.toLowerCase().includes(searchContent.toLowerCase()) || profile.username.toLowerCase().includes(searchContent.toLowerCase()) || profile.id.toString() == searchContent);
    }

    return (
        <div>
            <h1 className="mx-2 mb-3">User Profiles</h1>

            <FormControl
                type="text"
                className="ms-2 mb-3"
                style={{ width: "250px" }}
                placeholder="Search 🔎"
                onChange={(e) => setSearchContent(e.target.value)}
            />

            <Row className="gy-3 gx-4">
                {profileData.filter(searchFilter).sort(u => u.username === userData?.user.username ? -1 : 1).map(u =>
                    <Col xs={12} md={6} lg={4}>
                        <Card className="m-2">
                            <Card.Body>
                                <Card.Title className="mb-3">
                                    <h3 className="mb-0">{u.displayName ?? u.username} </h3>
                                    <small>{u.username}</small>
                                </Card.Title>
                                <h5>[Insert Rank Title Here]</h5>
                                <br />
                                <h4>XP: {u.xp}</h4>
                                <h4>Tokens: {u.tokens}</h4>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

        </div>
    )
}