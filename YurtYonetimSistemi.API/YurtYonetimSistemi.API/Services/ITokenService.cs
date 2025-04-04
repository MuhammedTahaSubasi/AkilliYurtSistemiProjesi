using YurtYonetimSistemi.API.Models;

namespace YurtYonetimSistemi.API.Services
{
    public interface ITokenService
    {
        string CreateToken(Kullanici kullanici);
    }
}
