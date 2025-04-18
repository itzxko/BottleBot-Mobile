import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useUrl } from "./UrlProvider";

const UsersContext = createContext<any>(null);

export const UsersProvider = ({ children }: any) => {
  const [users, setUsers] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [roles, setRoles] = useState([]);
  const { ipAddress, port, urlString } = useUrl();
  const [totalPages, setTotalPages] = useState();
  const [allUsers, setAllUsers] = useState([]);

  interface user {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
      middleName: string;
      dateOfBirth: Date;
      gender: string;
      civilStatus: string;
      nationality: string;
    };
    contactInfo: {
      address: {
        houseNumber: number;
        street: string;
        barangay: string;
        city: string;
      };
      phoneNumbers: [string];
    };
    economicInfo: {
      employmentStatus: string;
      occupation: string;
    };
    credentials: {
      level: string;
      email: string;
      password: string;
    };
  }

  const getAllUsers = async () => {
    try {
      let url = `${urlString}/api/users?limit=0`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setAllUsers(response.data.users);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const getUsers = async (
    userName: string,
    pageNumber: number,
    limit: number,
    status: string
  ) => {
    if (pageNumber && limit && status) {
      try {
        let url = `${urlString}/api/users?userName=${userName}&page=${pageNumber}&limit=${limit}&status=${status}`;

        let response = await axios.get(url);

        if (response.data.success === true) {
          setUsers(response.data.users);
          setTotalPages(response.data.totalPages);
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  const getCitizens = async (
    user: string,
    pageNumber: number,
    limit: number
  ) => {
    try {
      let url = `${urlString}/api/users?userName=${user}&status=active&level=citizen&page=${pageNumber}&limit=${limit}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setCitizens(response.data.users);
        setTotalPages(response.data.totalPages);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        citizens,
        getUsers,
        totalPages,
        getCitizens,
        allUsers,
        getAllUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);
