# Stage 1 : build stage

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /api

# restore

COPY ["api.csproj", "./"]
RUN dotnet restore './api.csproj'

# build

COPY . .
RUN dotnet build "api.csproj" -c Release -o /app/build

# publish

FROM build AS publish
RUN dotnet publish "api.csproj" -c Release -o /app/publish

# Stage 2 : run stage

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
ENV ASPNETCORE_URLS=http://+:5001
EXPOSE 5001
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "api.dll"]




